import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from "cors";

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000 
    }
});
io.on('connection', (socket) => {
    console.log('a user connected');
});

interface Room {
    id: string;
    players: { id: string; symbol: string;moves:number[] }[];
    currentTurn: string;
    board: (string | null)[];
    gameOver: boolean;
    winner: string | null;
}

const rooms: Record<string, Room> = {};
const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};
function checkResult(board:(string)[]) {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    // Check for winner
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: pattern };
      }
    }
    
    // Check for draw (all cells filled)
    const isDraw = board.every(cell => cell !== null);
    
    return {
      winner: null,
      draw: isDraw,
      line: null
    };
  }
io.on("connection",(socket)=>{
    socket.on("createRoom",(callback)=>{

        const roomId = generateRoomId();
        rooms[roomId] = {
            id: roomId,
            players: [{ id: socket.id, symbol: 'O',moves:[] }],
            currentTurn: socket.id,
            board: Array(9).fill(null),
            gameOver: false,
            winner: null
          };
          socket.join(roomId);
          callback({
            success: true,
            roomId,
            symbol: 'O'
          });
    })
    socket.on("joinRoom",(roomId,callback)=>{

        const room = rooms[roomId];
        if(!room){
            callback({
                success:false,
                message:"room not found"
            })
            return;
        }
        if (room.players.length >= 2) {
            callback({
              success: false,
              message: 'Room is full'
            });
            return;
          }
        else{
            room.players.push({ id: socket.id, symbol: 'X',moves:[] });
            socket.join(roomId);
            callback({
                success:true,
                roomId,
                symbol:'X'
            })
            io.to(roomId).emit('playerJoined', {
                playerId: socket.id,
                symbol: 'X'
            });

            if (room.players.length === 2) {
                io.to(roomId).emit('gameStart', {
                  board: room.board,
                  currentTurn: room.currentTurn
                });
            }
        }
    })
    socket.on("makeMove",(roomId,position,callback)=>{
        const room = rooms[roomId];
        if(!room){
            callback({
                success:false,
                message:"room not found"
            })
            return;
        }
        const player = room.players.find(p=>p.id==socket.id);
        const opponent = room.players.find(p=>p.id!==socket.id);
        if(!player){
            callback({
                success:false,
                message:"player not found"
            })
            return;
        }
        room.board[position] = player.symbol;
        let fadePosition = null;
        player.moves.push(position);
        if(player.moves.length==4){
          const position:number = player.moves[0];
          player.moves.shift();
          room.board[position] = null
        }
        if(opponent?.moves.length==3){
          fadePosition = opponent.moves[0];
        }
        const result = checkResult(room.board as string[]);
        if (result.winner) {
            room.gameOver = true;
            room.winner = socket.id;
            
            io.to(roomId).emit('gameOver', {
              board: room.board,
              winner: player.symbol,
              winningLine: result.line
            });
            
            callback({
              success: true,
              board: room.board,
              gameOver: true
            });
            
          } else if (result.draw) {
            room.gameOver = true;
            
            io.to(roomId).emit('gameOver', {
              board: room.board,
              draw: true
            });
            
            callback({
              success: true,
              board: room.board,
              gameOver: true,
              draw: true
            });
        }
        else {
            // Switch turns
            const nextPlayer = room.players.find(p => p.id !== socket.id);
            if(nextPlayer==undefined){
                callback({
                    success:false,
                    message:"player not found!"
                })
                return;
            }
            room.currentTurn = nextPlayer.id;
            
            // Broadcast the move to all players in the room
            io.to(roomId).emit('moveMade', {
              board: room.board,
              position,
              symbol: player.symbol,
              nextTurn: nextPlayer.id,
              fadePosition
            });
            
            callback({
              success: true,
              board: room.board
            });
          }

    })
    socket.on("gameRestart",(roomId,callback)=>{
        console.log("restart req reached");
        const room = rooms[roomId]
        if (!room) {
            callback({
              success: false,
              message: 'Room not found'
            });
            return;
          }
          
        
          room.board = Array(9).fill(null);
          room.gameOver = false;
          room.winner = null;
          
          // Switch who goes first this time
          const playerIndex = room.players.findIndex(p => p.id === room.currentTurn);
          const nextPlayerIndex = (playerIndex + 1) % room.players.length;
          room.currentTurn = room.players[nextPlayerIndex].id;
          
          // Notify all players in the room
          io.to(roomId).emit('gameRestart', {
            board: room.board,
            currentTurn: room.currentTurn
          });
          
          callback({
            success: true
          });
    })
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        
        // Find and clean up any rooms the player was in
        for (const roomId in rooms) {
          const room = rooms[roomId];
          const playerIndex = room.players.findIndex(p => p.id === socket.id);
          
          if (playerIndex !== -1) {
            socket.to(roomId).emit('playerLeft', {
              playerId: socket.id
            });
            
            // Remove the room if it's now empty
            if (room.players.length <= 1) {
              delete rooms[roomId];
              console.log(`Room ${roomId} deleted`);
            } else {
              // Remove the player from the room
              room.players.splice(playerIndex, 1);
              
              // If game was in progress, mark it as over
              if (!room.gameOver) {
                room.gameOver = true;
                socket.to(roomId).emit('gameOver', {
                  board: room.board,
                  opponentLeft: true
                });
              }
            }
          }
        }
      });

})
server.listen(3001, () => {
  console.log('server running at http://localhost:3000');
});
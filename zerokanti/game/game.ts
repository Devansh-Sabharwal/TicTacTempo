
import { io, Socket } from 'socket.io-client';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default class Game {
    public socket:Socket|null;
    public roomId:string|null;
    public playerSymbol:string|null;
    public board;
    public isMyTurn:boolean;
    public gameStarted:boolean;
    public gameOver:boolean;
    public winner:string|null;
    public winningLine:string[]|null;
    public isDraw:boolean;
    public opponentLeft;
    public fadeIndex:number|null;

    public onBoardUpdate:((data:any)=>void)|null;
    public onGameStart:((data: { board: any[]; isMyTurn: boolean }) => void)|null;
    public onGameOver:((data:any)=>void)|null;
    public onPlayerJoin:((data:any)=>void)|null;
    public onPlayerLeave:((data:any)=>void)|null;
    public onError:((message: string) => void)|null;
  constructor() {
    // Socket connection
    this.socket = null;
    
    // Game state
    this.roomId = null;
    this.fadeIndex = null;
    this.playerSymbol = null;
    this.board = Array(9).fill(null);
    this.isMyTurn = false;
    this.gameStarted = false;
    this.gameOver = false;
    this.winner = null;
    this.winningLine = null;
    this.isDraw = false;
    this.opponentLeft = false;
    
    // Event callbacks
    this.onBoardUpdate = null;
    this.onGameStart = null;
    this.onGameOver = null;
    this.onPlayerJoin = null;
    this.onPlayerLeave = null;
    this.onError = null;
  }
  async connect(serverUrl = apiUrl){
    try{
        this.socket = io(serverUrl);
        return await new Promise((res,rej)=>{
            if(!this.socket) return;
            this.socket.on('connect',()=>{
                console.log("User connected with",this.socket?.id);
                this.initListners();
                res(this.socket?.id);
            })
            this.socket.on('connect_error', (error) => {
                console.log('Connection error:', error);
                rej(error);
              });
            });
          } catch (error) {
            console.error('Error connecting to server:', error);
            throw error;
          }
    }
  initListners(){
    if(!this.socket){
        console.log("not connected");
        return;
    }
    this.socket.on('playerJoined', (data) => {
        console.log('Player joined:', data);
        if (this.onPlayerJoin) {
          this.onPlayerJoin(data);
        }
      });
    
    this.socket.on('gameStart',(data)=>{
        console.log("Game started");
        this.gameStarted = true;
        this.board = data.board;
        this.isMyTurn = (data.currentTurn === this.socket?.id)

        if (this.onGameStart) {
            this.onGameStart({
              board: this.board,
              isMyTurn: this.isMyTurn
            });
          }
    })

    this.socket.on('moveMade', (data) => {
        console.log('Move made:', data);
        this.board = data.board;
        this.isMyTurn = data.nextTurn === this.socket?.id;
        
        if (this.onBoardUpdate) {
          this.onBoardUpdate({
            board: this.board,
            lastMove: data.position,
            lastSymbol: data.symbol,
            isMyTurn: this.isMyTurn,
            fadeIndex: data.fadePosition
          });
        }
      });

      this.socket.on('gameOver', (data) => {
        console.log('Game over:', data);
        this.gameOver = true;
        this.board = data.board;
        this.winner = data.winner;
        this.winningLine = data.winningLine;
        this.isDraw = data.draw || false;
        this.opponentLeft = data.opponentLeft || false;
        this.isMyTurn = false;
        
        if (this.onGameOver) {
          this.onGameOver({
            board: this.board,
            winner: this.winner,
            winningLine: this.winningLine,
            draw: this.isDraw,
            opponentLeft: this.opponentLeft
          });
        }
      });

      this.socket.on('gameRestart', (data) => {
        console.log('Game restarted:', data);
        this.board = data.board;
        this.isMyTurn = data.currentTurn === this.socket?.id;
        this.gameOver = false;
        this.winner = null;
        this.winningLine = null;
        this.isDraw = false;
        this.opponentLeft = false;
        
        if (this.onGameStart) {
          this.onGameStart({
            board: this.board,
            isMyTurn: this.isMyTurn
          });
        }
      });
      
      // Player left the room
      this.socket.on('playerLeft', (data) => {
        console.log('Player left:', data);
        
        if (this.onPlayerLeave) {
          this.onPlayerLeave(data);
        }
      });
  }
  createRoom() {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.socket.connected) {
        reject(new Error('Socket not connected'));
        return;
      }
      
      this.socket.emit('createRoom', (response:any) => {
        if (response.success) {
          this.roomId = response.roomId;
          this.playerSymbol = response.symbol;
          console.log(`Room created: ${this.roomId}, You are: ${this.playerSymbol}`);
          resolve(response);
        } else {
          console.log('Failed to create room:', response.message);
          reject(new Error(response.message));
        }
      });
    });
  }
  joinRoom(roomId:string){
    return new Promise((resolve,reject)=>{
        if(!this.socket || !this.socket.connected){
            reject(new Error("Socket not connected"));
            return;
        }
        this.socket.emit('joinRoom',roomId,(response:any)=>{
            if (response.success) {
                this.roomId = response.roomId;
                this.playerSymbol = response.symbol;
                console.log(`Joined room: ${this.roomId}, You are: ${this.playerSymbol}`);
                resolve(response);
              } else {
                console.log('Failed to join room:', response.message);
                reject(new Error(response.message));
              }
        })
    })
  }
  makeMove(position:number){
    return new Promise((res,reject)=>{
      if (!this.socket || !this.socket.connected) {
        reject(new Error('Socket not connected'));
        return;
      }
      
      if (!this.roomId) {
        reject(new Error('Not in a room'));
        return;
      }
      
      if (!this.gameStarted) {
        reject(new Error('Game not started yet'));
        return;
      }
      
      if (this.gameOver) {
        reject(new Error('Game is already over'));
        return;
      }
      
      if (!this.isMyTurn) {
        reject(new Error('Not your turn'));
        return;
      }
      
      if (this.board[position] !== null) {
        reject(new Error('Position already taken'));
        return;
      }
      this.socket.emit('makeMove', 
        this.roomId,
        position
      , (response:any) => {
        if (response.success) {
          // Server will broadcast the updated state, so we don't update local state here
          res(response);
        } else {
          console.log('Failed to make move:', response.message);
          reject(new Error(response.message));
          
          if (this.onError) {
            this.onError(response.message);
          }
        }
      
      });
    })
  }
  restartGame() {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.socket.connected) {
        reject(new Error('Socket not connected'));
        return;
      }
      
      if (!this.roomId) {
        reject(new Error('Not in a room'));
        return;
      }
      
      if (!this.gameOver) {
        reject(new Error('Game is not over yet'));
        return;
      }
      
      this.socket.emit('gameRestart', this.roomId, (response:any) => {
        if (response.success) {
          // Server will broadcast the restart, so we don't update local state here
          console.log("restart called ")
          resolve(response);
        } else {
          console.log('Failed to restart game:', response.message);
          reject(new Error(response.message));
          
          if (this.onError) {
            this.onError(response.message);
          }
        }
      });
    });
  }
  getRoomId() {
    return this.roomId;
  }

  // Get player's symbol (X or O)
  getPlayerSymbol() {
    return this.playerSymbol;
  }

  // Get current board state
  getBoard() {
    return [...this.board]; // Return a copy to prevent direct mutations
  }

  // Check if it's the player's turn
  isPlayerTurn() {
    return this.isMyTurn;
  }

  // Get game over status
  isGameOver() {
    return this.gameOver;
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.roomId = null;
      this.playerSymbol = null;
      this.board = Array(9).fill(null);
      this.isMyTurn = false;
      this.gameStarted = false;
      this.gameOver = false;
      this.winner = null;
      this.winningLine = null;
      this.isDraw = false;
    }
  }
}
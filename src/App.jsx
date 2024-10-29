import "./App.css";
import logo from "/logo.png";
import { makeShuffledDeck } from "./utils.jsx";
import { useState } from "react";

function App() {
  // Set default value of card deck to new shuffled deck
  const [cardDeck, setCardDeck] = useState(makeShuffledDeck());
  // currCards holds the cards from the current round
  const [player1Cards, setplayer1Cards] = useState(null);
  const [player2Cards, setplayer2Cards] = useState(null);
  const [player1Score, setplayer1Score] = useState(0);
  const [player2Score, setplayer2Score] = useState(0);
  const [playerTies, setPlayerTies] = useState(0);
  const [winner , setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false)

  const resetGame = () => {
    setCardDeck(makeShuffledDeck())
    setplayer1Cards(null);
    setplayer2Cards(null);
    setplayer1Score(0);
    setplayer2Score(0);
    setPlayerTies(0);
    setGameOver(false);
    setWinner(null);
  }

  const dealCards = () => {
    if (cardDeck.length < 2) {
      setGameOver(true);
      finalWinner();
      return
    }
    const player1Draw = cardDeck[0];
    const player2Draw = cardDeck[1];

    setplayer1Cards(player1Draw);
    setplayer2Cards(player2Draw);

    setCardDeck(cardDeck.slice(2));

    checkWinner(player1Draw,player2Draw)
  };

  const checkWinner = (card1, card2) => {
    if (card1.rank > card2.rank){
      setplayer1Score(player1Score + 1)
    } else if (card2.rank > card1.rank){
      setplayer2Score(player2Score + 1)
    } else {
      setPlayerTies(playerTies + 1)
    }
  }

  const finalWinner = () =>{
    if (player1Score > player2Score) {
      setWinner("Player 1 Wins")
    } else if (player1Score < player2Score){
      setWinner("Player 2 Wins")
    } else {
      setWinner("It is Ties")
    }
  }
  // You can write JavaScript here, just don't try and set your state!

  // You can access your current components state here, as indicated below
  const currCardElems = player1Cards && player2Cards && (
    <div className="cardimg">
      <div>
        Player 1: 
        <div>
            <img src={player1Cards.img}/>          
        </div>
      </div>
      <div>
        Player 2: 
      <div>
          <img src={player2Cards.img}/>
      </div>        
      </div>

    </div>
  )

  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Rocket logo" />
      </div>
      <div className="card">
        <h2>React High Card 🚀</h2>
      </div>
      {gameOver && (
        <div>
          <h1>Game Over</h1>
          <h1>{winner}</h1>
        </div>
      )}
      <div className="scoreboard">
        <h3>Player 1 Score: {player1Score}</h3>
        <h3>Player 2 Score: {player2Score}</h3>
        <h3>Player Ties: {playerTies}</h3>
      </div>
      <div>
        <button onClick={gameOver? resetGame : dealCards}>{gameOver ? "Reset Game" : "Deal"}</button>
      </div>
      <div>{currCardElems}</div>
    </>
  );
}

export default App;

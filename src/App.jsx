import "./App.css";
import logo from "/logo.png";
import { makeShuffledDeck } from "./utils.jsx";
import { useState } from "react";

function App() {
  // redundant comment
  const [cardDeck, setCardDeck] = useState(makeShuffledDeck());
  // redundant comment
  const [player1Cards, setplayer1Cards] = useState(null); // I would recommend always putting the data structure this app defines here. e.g. {}, [], "", 0
  const [player2Cards, setplayer2Cards] = useState(null); // that is easier to understand than null
  const [player1Score, setplayer1Score] = useState(0);
  const [player2Score, setplayer2Score] = useState(0);
  const [playerTies, setPlayerTies] = useState(0);
  const [winner , setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false)

  const resetGame = () => {
    // maybe we can have a single gameState object, that contains all this information instead of so many state variables
    // then I can create a default gameState
    /* 
      const defaultGameState = {
        cardDeck: makeShuffledDeck(),
        playerOne: {
          cards: [],
          score: 0,
        },
        playerTwo: {
          cards: [],
          score: 0,
        },
        ties: 0,
        gameOver: false,
        winner: null
      }

      and then just update State like: setGameState(defaultGameState)

    */
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
    // add some comment here describing what the early return is for. Such early returns are very good practice!
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
    /* 
      here we could also use early returns potentially

      if (card1.rank === card2.rank) return setPlayerTies(playerTies + 1)
      if (card1.rank > card2.rank) return setPlayer1Score(player1Score +1)
      setPlayer2Score(player2Score +1)

      More of a subjective comment, but I prefer if statements over if else spaghetti
    */
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

// this here is returning html. I think no need to store in a variable. I would rather store it in a separate component instead
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

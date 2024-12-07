import { useEffect, useState } from 'react'
import './App.css'
import { makeShuffledDeck } from './utils.jsx'

//game rule
//Each hand starts with 2 cards and a third may optionally be dealt. The values are summed and the nearest to 9 wins. Where the sum goes beyond 9, the value returns to 0 instead of going to 10 e.g. A pair of cards 6 and 7 has a value of 3, not 13 and three cards 9, 6 and 9 have a value of 4.

function App() {
  // carddeck for the shuffle deck function
  const [cardDeck, setCardDeck] = useState(makeShuffledDeck());
  //set player card value and the total card value in player
  const [playerCard, setPlayerCard] = useState([]);
  const [playerTotal, setPlayerTotal] = useState(0)
  const [bankerCard, setBankerCard] = useState([]);
  const [bankerTotal, setBankerTotal] = useState(0);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [dealClick, setDealClick] = useState(false);
  const [drawCard, setdrawCard] = useState(false);
  const [bet, setbet] = useState(false);
  const [balance, setBalance] = useState(100)
  const [playerBet, setPlayerBet] = useState(false);
  const [bankerBet, setBankerBet] = useState(false);
  const [betAmount, setbetAmount] = useState(0);
  const [selectSide, setSelectSide] = useState(null);

  const betInput = () => {
    if (betAmount > 0 && betAmount <= balance) {
      setBalance(balance - betAmount);
      setbet(true);
    };
  }

  const resetGame = () => {
    setCardDeck(makeShuffledDeck())
    setPlayerCard([]);
    setPlayerTotal(0);
    setBankerCard([]);
    setBankerTotal(0);
    setGameOver(false);
    setWinner(null);
    setGameStart(false);
    setDealClick(false);
    setdrawCard(false);
    setbet(false);
    setPlayerBet(false);
    setBankerBet(false);
    setbetAmount(0);
    setSelectSide(null);
  };

  const calculateTotal = (total) => {
    while (total > 9) {
      total -= 10;
    }
    return total;
  }

  const dealCard = () => {
    const playerDraw1 = cardDeck[0];
    const playerDraw2 = cardDeck[1];
    const bankerDraw1 = cardDeck[2];
    const bankerDraw2 = cardDeck[3];

    setPlayerCard([playerDraw1, playerDraw2]);
    const addPlayerTotal = playerDraw1.rank + playerDraw2.rank;
    const checkPlayerTotal = calculateTotal(addPlayerTotal);
    setPlayerTotal(checkPlayerTotal);

    setBankerCard([bankerDraw1, bankerDraw2]);
    const addBankerTotal = bankerDraw1.rank + bankerDraw2.rank;
    const checkBankerTotal = calculateTotal(addBankerTotal);
    setBankerTotal(checkBankerTotal);

    setCardDeck(cardDeck.slice(4));
    setGameStart(true);
    setDealClick(true);
  };

  const playerHit = () => {
    setdrawCard(true);
    const playerDraw1 = cardDeck[0];
    const bankerDraw1 = cardDeck[1];
    setPlayerCard([...playerCard, playerDraw1]);
    setPlayerTotal(prevTotal => calculateTotal(prevTotal + playerDraw1.rank));
    if (bankerTotal <= 5) {
      setBankerCard([...bankerCard, bankerDraw1]);
      setBankerTotal(prevTotal => calculateTotal(prevTotal + bankerDraw1.rank))
    };
    setCardDeck(cardDeck.slice(2));
    setdrawCard(false);
    setGameOver(true)
  };

  const bankerHit = () => {
    setdrawCard(true);
    const bankerDraw1 = cardDeck[0];
    const playerDraw1 = cardDeck[1];
    setBankerCard([...bankerCard, bankerDraw1]);
    setBankerTotal(prevTotal => calculateTotal(prevTotal + bankerDraw1.rank));
    if (playerTotal <= 5) {
      setPlayerCard([...playerCard, playerDraw1]);
      setPlayerTotal(prevTotal => calculateTotal(prevTotal + playerDraw1.rank))
    };
    setCardDeck(cardDeck.slice(2));
    setGameOver(true);
  };

  useEffect(() => {
    if (gameStart && !gameOver) {
      if (playerTotal === 8 || playerTotal === 9) {
        setWinner("Player Wins");
        setGameOver(true);
      } else if (bankerTotal === 8 || bankerTotal === 9) {
        setWinner("Banker Wins");
        setGameOver(true);
      }
    }
  }, [playerTotal, bankerTotal, gameStart, gameOver]);

  useEffect(() => {
    if (gameOver) {
      if (playerTotal > bankerTotal) {
        setWinner("Player Wins");
      } else if (bankerTotal > playerTotal) {
        setWinner("Banker Wins");
      } else {
        setWinner("It a Push");
      }
    }
  }, [playerTotal, bankerTotal, gameOver]);

  const winnerWinner = () => {
    if (selectSide === "Player" && winner === "Player Wins") {
      setBalance(prevBalance => prevBalance + betAmount * 2);
    } else if (selectSide === "Banker" && winner === "Banker Wins") {
      setBalance(prevBalance => prevBalance + betAmount * 2);
    } else if (winner === "It a Push") {
      setBalance(prevBalance => prevBalance + betAmount);
    };
  };

  const stayButton = () => {
    setGameOver(true);
    if (playerTotal > bankerTotal) {
      setWinner("Player Wins");
      setGameOver(true);
    } else if (bankerTotal > playerTotal) {
      setWinner("Banker Wins");
      setGameOver(true);
    } else {
      setWinner("It a Push");
      setGameOver(true);
    }
  }

  useEffect(() => {
    if (gameOver && winner) {
      winnerWinner();
    }
  }, [gameOver, winner]);

  return (
    <>
      <h1>baccarat</h1>
      <h4>Total Balance : {balance}</h4>
      <h3>please Select which to bet</h3>

      <div>
        <input
          type="text"
          value={betAmount}
          onChange={(event) => setbetAmount(Number(event.target.value))}
          placeholder='Enter bet Amount'
        />
        <button onClick={betInput} disabled={gameStart || betAmount <= 0}>Bet</button>
      </div>

      <div>
        <button onClick={() => { setSelectSide("Player"); setPlayerBet(true); dealCard(); }} disabled={!bet || gameStart}>Player</button>
        <button onClick={() => { setSelectSide("Banker"); setBankerBet(true); dealCard(); }} disabled={!bet || gameStart}>Banker</button>
      </div>
      <div>
        {gameStart && (
          <>
            <div className="winner">
              {winner && <h3>{winner}</h3>}
            </div>
            <div className='gamediv'>
              <div className="playerDiv">
                <h3>Player :</h3>
                <h5>Total: {playerTotal}</h5>
                {playerCard.map((card, index) => (
                  <img key={index} src={card.img} />
                ))}
                <button onClick={playerHit} disabled={gameOver || bankerBet}>Player Hit</button>
                <button onClick={stayButton} disabled={gameOver || bankerBet}>Stay</button>
              </div>
              <div className='bankerDiv'>
                <h3>Banker :</h3>
                <h5>Total: {bankerTotal}</h5>
                {bankerCard.map((card, index) => (
                  <img key={index} src={card.img} />
                ))}
                <button onClick={bankerHit} disabled={gameOver || playerBet}>Dealer Hit</button>
                <button onClick={stayButton} disabled={gameOver || playerBet}>Stay</button>
              </div>
            </div>
            {gameOver && <button onClick={resetGame}>Reset</button>}
          </>
        )}
      </div>

    </>
  )
}

export default App

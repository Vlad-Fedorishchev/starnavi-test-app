import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';


const App = () => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [modes, setModes] = useState([]);
  const [selectedSquares, setSelectedSquares] = useState([]);

  useEffect(() => {
    axios.get('https://60816d9073292b0017cdd833.mockapi.io/modes')
      .then(response => {
        setModes(response.data);
      })
      .catch(error => {
        console.error('Ошибка получения данных:', error);
      });
  }, []);

  const handleModeChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "") {
      setSelectedMode(null);
      setSelectedSquares([]);
    } else {
      const mode = modes.find(mode => mode.id === selectedValue);
      setSelectedMode(mode);
      setSelectedSquares([]);
    }
  };

  const renderSquares = () => {
    const squares = [];
    if (selectedMode) {
      for (let i = 0; i < selectedMode.field; i++) {
        for (let j = 0; j < selectedMode.field; j++) {
          const isSelected = selectedSquares.find(sq => sq.row === i && sq.col === j);
          squares.push(
            <div
              key={`${i}-${j}`}
              className={`square ${isSelected ? 'selected' : ''}`}
              onMouseEnter={() => handleSquareHover(i, j)}
            />
          );
        }
      }
    }
    return squares;
  };

  const handleSquareHover = (row, col) => {
    setSelectedSquares(prevSquares => {
      if (prevSquares.find(sq => sq.row === row && sq.col === col)) {
        return prevSquares.filter(sq => !(sq.row === row && sq.col === col));
      } else {
        return [...prevSquares, { row, col }];
      }
    });
  };

  const startGame = () => {
    if (modes.length > 0) {
      setSelectedMode(modes[0]);
      setSelectedSquares([]);
      console.log('Игра начинается с режима:', modes[0].field);
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="select-container">
          <select onChange={handleModeChange} defaultValue="" className="select">
            <option value="" disabled hidden>Pick mode</option>
            {modes.map(mode => (
              <option key={mode.id} value={mode.id}>
                {`Mode ${mode.field}x${mode.field}`}
              </option>
            ))}
          </select>
          <button onClick={startGame} className="startButton">Start</button>
        </div>
        <div className="gameContainer">
          <div className="gameField" style={{'--field-size': selectedMode?.field || 1}}>
            {renderSquares()}
          </div>

          <div className="selectedSquares">
          <h2 className='selectedSquares_title'>Hover squares</h2>
          <ul>
            {selectedSquares.map((square, index) => (
              <li key={index}>{`row ${square.row + 1} col ${square.col + 1}`}</li>
            ))}
          </ul>
        </div>
        </div>
      </div>
    </div>
  );
};



export default App;

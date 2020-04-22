import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
    return (
    <button className="square" onClick={props.onClick}>
        {props.value}
    </button>
    );
  }
  
  class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        }
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }

    renderSquare(i) {
        console.log(i);
        return (
            <Square 
                value={this.state.squares[i]} 
                onClick={() => this.handleClick(i)}/>
        );
    }
  
    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = `Winner: ${winner}`
        } else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        const rows = []
        for (let row = 0; row < 3; row++) {
            const squares = []
            for (let col = 0; col < 3; col++) {
                squares.push(<span key={(row * 3 + col)}>{this.renderSquare(row * 3 + col)}</span>);
            }
            rows.push(<div key={row} className="board-row">{squares}</div>);
        }
        
        return (
            <div>
                <div className="status">{status}</div>
                {rows}
            </div>
        );
    }
  }
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }
  

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }


  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
const board = JSON.parse(localStorage.getItem('pegs'))
const rows = JSON.parse(localStorage.getItem('rows'))
let startPosition = null
const btnSolution = document.getElementById('btn-solution')

const printBoard = () => {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = ''
  let position = 0

  for (let row = 0; row < rows; row++) {
      const rowDiv = document.createElement('div')
      rowDiv.className = 'row'

      for (let col = 0; col <= row; col++) {
          const pegDiv = document.createElement('div')
          pegDiv.className = 'peg'
          pegDiv.id = `peg-${position}`
          
          pegDiv.addEventListener('click', () => setStartPosition(pegDiv.id.split('-')[1]))

          rowDiv.appendChild(pegDiv)
          position++
      }
      boardDiv.appendChild(rowDiv)
  }
}

const setStartPosition = (position) => {
  if (startPosition === null) {
      startPosition = position
      board[startPosition] = false
      document.getElementById(`peg-${position}`).classList.add('empty')
      document.getElementById('btn-solution').classList.add('show')
  }
}

const generateMoves = (rows) => {
  const moves = []

  // A helper function to get the position in the triangular grid based on (row, col)
  function getPosition(row, col) {
      if (col < 0 || col > row) return null // Ensure valid column in the row
      return (row * (row + 1)) / 2 + col
  }

  // For each position on the board
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col <= row; col++) {
      const pos = getPosition(row, col); // Current position

      // get lateral options
      if (row > 1) {
        if (col + 2 <= row) {
          const rightTo = getPosition(row, col + 2)
          const rightOver = getPosition(row, col + 1)
          moves.push([pos, rightOver, rightTo])
        }
        if (col - 2 >= 0) {
          const leftTo = getPosition(row, col - 2)
          const leftOver = getPosition(row, col - 1)
          moves.push([pos, leftOver, leftTo])
        }
      }

      // get above options
      if (row > 1) {
        if (col > 1) {
            const upLeftTo = getPosition(row - 2, col - 2)
            const upLeftOver = getPosition(row - 1, col - 1)
            moves.push([pos, upLeftOver, upLeftTo])
        }
      
        if (col < row - 1) {
            const upRightTo = getPosition(row - 2, col)
            const upRightOver = getPosition(row - 1, col)
            moves.push([pos, upRightOver, upRightTo])
        }
      }

      // get below options
      if (row < rows - 2) {
        const downLeftTo = getPosition(row + 2, col)
        const downLeftOver = getPosition(row + 1, col)
        const downRightTo = getPosition(row + 2, col + 2)
        const downRightOver = getPosition(row + 1, col + 1)
        moves.push([pos, downLeftOver, downLeftTo])
        moves.push([pos, downRightOver, downRightTo])
      }
    }
  }

  return moves
}

// Check if there is at least one valid move left
const hasValidMove = (board, moves) => {
  for (const [from, over, to] of moves) {
    if (board[from] === true && board[over] === true && board[to] === false) {
      return true
    }
  }
  return false
}

const solve = (board, moves) => {
  const solutionSteps = []

  const backtrack = () => {
    const pegCount = board.reduce((count, peg) => count + peg, 0)

    // Check if the game is won (only one peg left)
    if (pegCount === 1) return true

    // Check for a dead end (no valid moves left)
    if (!hasValidMove(board, moves)) return false

    // Try each move
    for (const [from, over, to] of moves) {
      // Only proceed if the move is valid
      if (board[from] === true && board[over] === true && board[to] === false) {
        // Make the move
        board[from] = false
        board[over] = false
        board[to] = true
        solutionSteps.push([from, over, to])

        // Recursively attempt to solve from the new state
        if (backtrack()) return true

        // Undo the move (backtracking)
        board[from] = true
        board[over] = true
        board[to] = false
        solutionSteps.pop()
      }
    }

    return false // No valid solution found
  }

  return backtrack() ? solutionSteps : null
}

const playSolution = () => {
  const moves = generateMoves(rows)

  if (!Array.isArray(moves) || moves.length === 0) {
    alert("Error: Moves could not be generated!")
    return
  }

  const solutionSteps = solve(board, moves)

  if (!solutionSteps) {
    alert("No solution found, even after trying multiple paths.")
    return
  }

  let stepIndex = 0

  const executeStep = () => {
    btnSolution.innerHTML = "Solving..."
    if (stepIndex >= solutionSteps.length) {
      btnSolution.innerHTML = "Solved!"
      btnSolution.classList.remove('processing')
      return
    }

    const [from, over, to] = solutionSteps[stepIndex]
    board[from] = false
    board[over] = false
    board[to] = true

    document.getElementById(`peg-${from}`).classList.add('empty')
    document.getElementById(`peg-${over}`).classList.add('empty')
    document.getElementById(`peg-${to}`).classList.remove('empty')

    stepIndex++
    setTimeout(executeStep, 500)
  }

  executeStep()
}

const handlerBtnSolve = () => {
  btnSolution.innerHTML = "Thinking..."
  btnSolution.style.pointerEvents = "none"
  btnSolution.classList.add('processing')
  setTimeout(() => {
    playSolution()
  }, 100)
}

printBoard()
btnSolution.addEventListener('click', handlerBtnSolve)

const createBoard = (rows) => {
  const totalPositions = (rows * (rows + 1)) / 2
  const board = Array(totalPositions).fill(true)
  return board
}

const handlerBtnPlay = () => {
  const pegs = createBoard(Number(inpValue.value))
  localStorage.setItem('pegs', JSON.stringify(pegs))
  localStorage.setItem('rows', inpValue.value)
}
const handlerInpValue = () => {
  Number(inpValue.value) > 4 ? (
    btnPlay.classList.add('enabled'),
    btnPlay.classList.remove('disabled'),
    btnPlay.removeAttribute('disabled')
  ) : (
    btnPlay.classList.add('disabled'),
    btnPlay.classList.remove('enabled'),
    btnPlay.setAttribute('disabled')
  )
}
const inpValue = document.getElementById("inp-value")
const btnPlay = document.getElementById("btn-play")

inpValue.onkeyup = handlerInpValue
inpValue.onclick = handlerInpValue
btnPlay.onclick = handlerBtnPlay

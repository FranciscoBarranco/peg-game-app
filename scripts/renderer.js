const creatorPegs = (value) => {
  const arrPegs = []
  for (let counter = 1; counter <= value; counter++){
    arrPegs.push(Array.from({length: counter}, (_, i) => ((counter * (counter + 1)) / 2) - i).reverse().reduce((a, v) => ({...a, [v]: false}), {}))
  }
  return arrPegs
}
const handlerBtnPlay = () => {
  const pegs = creatorPegs(Number(inpValue.value))
  localStorage.setItem('pegs', JSON.stringify(pegs))
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

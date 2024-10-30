const pegs = JSON.parse(localStorage.getItem('pegs'))
let remainingOpts = 0

document.getElementById('print-pegs').innerHTML = (
  pegs.map((pegsRow, row) => {
    return `<li>
      <ul>
        ${Object.entries(pegsRow).map((peg, i) => `<li row="${row}" index="${i}" value="${peg[0]}" class="peg-item ${peg[1] === false ? 'enabled' : ''}" onclick="handlerPegs(this)"></li>`).join('')}
      </ul>
    </li>`
  }).join('')
)

const verifyStatus = () => {
  const remainingPlay = document.getElementsByClassName('enabled')
  // if (remainingPlay.length < 10) {
    for (let i = 0; i < remainingPlay.length; i++){
      getOptions(remainingPlay[i])
    }
    clearOptions()
    remainingOpts === 0 && (
      document.getElementById('finished-game').innerHTML = '<h1>Perdiste</h1>'
    )
  // }

}

const findPegLeap = (rowPeg, rowPlay, valPeg, valPlay, play, peg) => {
  let valLeap = 0
  if(rowPeg === rowPlay) {
    valLeap = valPeg > valPlay ? valPeg - 1 : valPeg + 1
  } else {
    valLeap = valPeg > valPlay ? valPeg - ((Math.abs(valPeg - valPlay)+1)/2) : valPeg + ((Math.abs(valPeg - valPlay)-1)/2)
  }
  const leapt = document.querySelector(`[value='${valLeap}']`)
  if (!leapt.classList.contains('empty')) {
    leapt.classList.add('empty')
    leapt.classList.remove('enabled')
    play.classList.add('empty')
    play.classList.remove('playing', 'enabled')
    peg.classList.add('enabled')
    peg.classList.remove('option', 'showOption', 'playing', 'empty')
    clearOptions()
    verifyStatus()
  }
}

const playPeg = (peg) => {
  const play = document.getElementsByClassName('playing')[0]
  const rowPlay = Number(play.getAttribute('row'))
  const rowPeg = Number(peg.getAttribute('row')) 
  const iPlay = Number(play.getAttribute('index'))
  const iPeg = Number(peg.getAttribute('index'))
  const valPlay = Number(play.getAttribute('value'))
  const valPeg = Number(peg.getAttribute('value'))
  if ((rowPlay === rowPeg && (iPlay + 2 === iPeg || iPlay - 2 === iPeg)) ||
  (rowPlay + 2 === rowPeg || rowPlay - 2 === rowPeg) && (iPeg === iPlay || iPeg + 2 === iPlay || iPeg - 2 === iPlay)) {
    findPegLeap(rowPeg, rowPlay, valPeg, valPlay, play, peg)
  }
}

const clearOptions = () => {
  const options = document.getElementsByClassName('option')
  if (options.length > 0) {
    for (let i = 0; i < options.length; i++){
      options[i].classList.remove('option', 'showOption')
    }
  }
}

const showOptions = () => {
  const options = document.getElementsByClassName('option')
  for (let i = 0; i < options.length; i++){
    options[i].classList.add('showOption')
  }
}

const getOptions = (play) => {
  const rowPlay = play.getAttribute('row')
  const iPlay = play.getAttribute('index')
  // get below options
  if (rowPlay < pegs.length - 2) {
    const rowOpts = document.querySelectorAll(`[row='${Number(rowPlay) + 2}']`)
    const rowLeap = document.querySelectorAll(`[row='${Number(rowPlay) + 1}']`)
    if (rowOpts[iPlay]?.classList.contains('empty') && rowLeap[iPlay]?.classList.contains('enabled'))
      {rowOpts[iPlay].classList.add('option')}
    if (rowOpts[Number(iPlay) + 2]?.classList.contains('empty') && rowLeap[Number(iPlay) + 1]?.classList.contains('enabled'))
      {rowOpts[Number(iPlay) + 2].classList.add('option')}
  }
  // get above options
  if (rowPlay > 1) {
    const rowOpts = document.querySelectorAll(`[row='${Number(rowPlay) - 2}']`)
    const rowLeap = document.querySelectorAll(`[row='${Number(rowPlay) - 1}']`)
    if (rowOpts[iPlay]?.classList.contains('empty') && rowLeap[iPlay]?.classList.contains('enabled'))
      {rowOpts[iPlay].classList.add('option')}
    if (rowOpts[Number(iPlay) - 2]?.classList.contains('empty') && rowLeap[Number(iPlay) - 1]?.classList.contains('enabled'))
      {rowOpts[Number(iPlay) - 2].classList.add('option')}
  }
  // get lateral options
  if (Number(iPlay) + 2 <= Object.keys(pegs[rowPlay]).length || Number(iPlay) > 2) {
    const rowOpts = document.querySelectorAll(`[row='${Number(rowPlay)}']`)
    if (rowOpts[Number(iPlay) - 2]?.classList.contains('empty') && !rowOpts[Number(iPlay) - 1]?.classList.contains('empty'))
      {rowOpts[Number(iPlay) - 2].classList.add('option')}
    if (rowOpts[Number(iPlay) + 2]?.classList.contains('empty') && !rowOpts[Number(iPlay) + 1]?.classList.contains('empty'))
      {rowOpts[Number(iPlay) + 2].classList.add('option')}
  }
  remainingOpts = document.getElementsByClassName('option').length
}

const handlerPegs = (peg) => {
  clearOptions()
  if (document.getElementsByClassName('empty').length === 0) {
    peg.classList.add('empty')
    verifyStatus()
  }

  if(!peg.classList.contains('empty')) {
    document.getElementsByClassName('playing').length === 0 ?
      peg.classList.add('playing') :
      document.getElementsByClassName('playing')[0].classList.remove('playing')
      peg.classList.add('playing')
      getOptions(document.getElementsByClassName('playing')[0])
      showOptions()
  } else {
    document.getElementsByClassName('playing').length === 1 && playPeg(peg)
  }
} 
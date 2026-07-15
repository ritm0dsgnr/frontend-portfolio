const priceElement = document.querySelector('.card__wrapper-info-bottom-price-text span:last-child')
const calcValue = document.querySelector('.calc-value')
const calcMinus = document.querySelector('.calc-minus')
const calcPlus = document.querySelector('.calc-plus')

const basePrice = 266
let currentCount = 1

const updatePrice = () => {
  priceElement.textContent = basePrice * currentCount
}

calcMinus.addEventListener('click', () => {
  if (currentCount > 1) {
    currentCount--
    calcValue.textContent = currentCount
    updatePrice()
  }
})

calcPlus.addEventListener('click', () => {
  currentCount++
  calcValue.textContent = currentCount
  updatePrice()
}) 
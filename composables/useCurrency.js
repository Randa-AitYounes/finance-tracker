export const useCurrency = (amount) => {
  const currency = computed(() => {
    return new Intl.NumberFormat('fr', {
        style: 'currency',
        currency: 'EUR'

    }).format(isRef(amount) ? amount.value : amount)
  })

  return {
    currency 
  }
}
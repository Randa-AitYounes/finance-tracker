export const useFetchTransactions = () => {
    const supabase = useSupabaseClient() 
    const transactions = ref([]) 
    const pending = ref(false)

    


const income = computed( () => transactions.value.filter(t => t.type == 'Income'))

const expense = computed( () => transactions.value.filter(t => t.type == "Expense"))

const incomeCount = computed(() => income.value.length)
const expenseCount = computed(() => expense.value.length)

const incomeTotal = computed(
   () => income.value.reduce((sum, transaction) => sum + transaction.amount, 0
))
const expenseTotal = computed(
   () => expense.value.reduce((sum, transaction) => sum + transaction.amount, 0
))



const fetchTransactions = async () => {
  pending.value = true
  try {
    
      const { data, error } = await supabase
        .from('transactions')
        .select()
        .order('created_at', { ascending: false })

        if (error) return []

         return data
   

    return data.value
  } finally {
    pending.value = false
  }
}


const refresh  = async () => transactions.value = await fetchTransactions()

const transactionGroupedByDate = computed(() => {
   let grouped = {}

   for (const transaction of transactions.value){
      const date = new Date(transaction.created_at).toISOString().split('T')[0]
      console.log(date)
   
   if(!grouped[date]){
      grouped[date] = []
   }

   grouped[date].push(transaction)
}

return grouped
 })

 return {
    transactions: {
        all: transactions,
        grouped: {
            byDate: transactionGroupedByDate
        },
        income,
        expense,
        incomeTotal,
        expenseTotal,
        incomeCount,
        expenseCount
    },
    refresh,
    pending
 }
 
}
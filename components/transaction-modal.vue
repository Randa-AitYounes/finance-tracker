<template>
           <UModal title="Add Transaction" v-model:open="isOpen" >
    <UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" />

    <template #body>
        <UForm :state="state" :schema="schema" ref="form" @submit.prevent="save">
 <UFormField label="Transaction Type" name="type" class="mb-4" required>
        <USelect placeholder="Select the transaction type" :items="types" class="w-full" v-model="state.type" />

     </UFormField>

     <UFormField label="Amount" name="amount" class="mb-4" required>
        <UInput type="number" placeholder="Amount" class="w-full" v-model.number="state.amount" />

     </UFormField>

      <UFormField label="Transaction date" name="created_at" class="mb-4" required>
        <UInput type="date" icon="i-heroicons-calendar-days-20-solid" class="w-full" v-model="state.created_at" />

     </UFormField>

      <UFormField label="Description" hint="Optional" name="description" class="mb-4" >
        <UInput placeholder="Description" class="w-full" v-model="state.description" />

     </UFormField>

     <UFormField label="Category" name="category" class="mb-4" v-if="state.type=='Expense'" required>
        <USelect placeholder="Category" :items="categories" class="w-full" v-model="state.category" />

     </UFormField>
     <UButton type="submit" color="neutral" variant="subtle" :loading="isLoading" >Save</UButton>
     </UForm>
    </template>
  </UModal>
</template>

<script setup>
import { categories, types } from '~/constants';
import {z} from 'zod'



const initialState = 
    {
    type: undefined,
    amount: 0,
    created_at: undefined,
    description: undefined,
    category: undefined
}

const state = ref({
    ...initialState
})

const isOpen = ref(false)

watch(isOpen, (val, oldVal) => {
  if (!val && oldVal) {
    console.log("la valeur est "+val+" et l'ancienne valeur est "+oldVal)
    resetForm()
  }
})

const resetForm = () => {
    Object.assign(state.value, initialState) 
    form.value.clear()
}

const defaultShema = z.object({
    created_at: z.string(),
    description: z.string().optional(),
    amount: z.number().positive('Amount needs to be more than 0')
})

const incomeSchema = z.object({
    type: z.literal('Income')
})

const expenseSchema = z.object({
    type: z.literal('Expense'),
    category: z.enum(categories)
})

const investmentSchema = z.object({
    type: z.literal('Investment')
})

const savingSchema = z.object({
    type: z.literal('Saving')
})

const schema = z.intersection(
    z.discriminatedUnion('type', [incomeSchema, expenseSchema, investmentSchema, savingSchema ]),
    defaultShema
)

const form = ref()
const isLoading = ref(false)
const supabase = useSupabaseClient()
const toast = useToast()
const emit = defineEmits('saved')

const save = async () => {
   if(form.value.errors.length) return

   isLoading.value = true
   try{

    const { error } = await supabase
  .from('transactions')
  .upsert({ ...state.value })
  
  if(!error){
    toast.add({
        'title': 'Transaction saved',
        'icon': 'i-i-heroicons-check-circle'

    })
    isOpen.value = false
    emit('saved')
    return
  }
 throw error

   } catch (e){

      toast.add({
        'title': 'Transaction not saved',
        'description': e.message,
        'icon': 'i-heroicons-exclamation-circle',
        'color': 'error'

    })

   
    } finally{
        isLoading.value = false

   }


}

</script>
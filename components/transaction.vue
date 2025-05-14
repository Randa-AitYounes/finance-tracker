<template>
    <div class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-1">
                <UIcon :name="icon" class="text-green-600" />
                <div>{{ transaction.description }}</div>
            </div>
            <div>
                <UBadge color="neutral" v-if="transaction.category">{{ transaction.category }}</UBadge>
            </div>
        </div>
        <div class="flex items-center justify-end space-x-2">
            <div>{{currency}}</div>
            <div>
                <UDropdownMenu :items="items" :ui="{
      content: 'w-48'
    }">
    <UButton color="white" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal" />
</UDropdownMenu>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    transaction: Object
})

const icon = computed(
    () => props.transaction.type == 'income' ? 'i-heroicons-arrow-up-right': 'i-heroicons-arrow-down-left'
)
const {currency} = useCurrency( props.transaction.amount)

const items = [
    {
        label:'Edit',
        icon: 'i-heroicons-pencil-square-20-solid',
        onSelect() {
      console.log('edit')
    }
    },
    {
        label:'Delete',
        icon: 'i-heroicons-trash-20-solid',
        onSelect() {
      console.log('delete')
    }
    }
]

</script>
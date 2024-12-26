<template>
  <div class="form-group mb-4">
    <label :for="inputId" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <div class="relative">
      <input
        type="text"
        v-model="internalValue"
        :readonly="!isEditing"
        :id="inputId"
        required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <i
          v-if="!isEditing"
          class="fas fa-edit cursor-pointer text-gray-500"
          @click="edit"
          @keydown.enter="edit"
          @keydown.space="edit"
          tabindex="0"
        />
        <i
          v-else
          class="fas fa-times cursor-pointer text-red-500 ml-2"
          @click="cancel"
          @keydown.enter="cancel"
          @keydown.space="cancel"
          tabindex="0"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, watch,
} from 'vue';

export default defineComponent({
  name: 'SettingsTextInputField',
  props: {
    modelValue: { type: String, default: '' },
    label: { type: String, default: '' },
  },
  setup(props, { emit }) {
    const originalValue = ref(props.modelValue);
    const internalValue = ref(props.modelValue);
    const isEditing = ref(false);
    const inputId = ref(`input-${Math.random().toString(36).substring(2, 9)}`);

    watch(internalValue, (newValue) => {
      emit('update:modelValue', newValue);
    });

    const edit = () => {
      isEditing.value = true;
    };

    const cancel = () => {
      isEditing.value = false;
      internalValue.value = originalValue.value;
    };

    return {
      internalValue,
      isEditing,
      edit,
      cancel,
      inputId,
    };
  },
});
</script>

<style scoped>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
</style>

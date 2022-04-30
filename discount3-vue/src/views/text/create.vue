<template>
  <text-detail :is-edit="false" />
</template>

<script>
import TextDetail from './components/TextDetail'

export default {
  name: 'EditText',
  components: { TextDetail }
}
</script>

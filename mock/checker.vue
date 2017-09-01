<template>
  <div class="vux-checker-box">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'checker',
  props: {
    defaultItemClass: String,
    selectedItemClass: String,
    disabledItemClass: String,
    type: {
      type: String,
      default: 'radio'
    },
    value: [String, Number, Array, Object],
    max: Number,
    dataid: {
      type: String
    }
  },
  watch: {
    value (newValue) {
      this.currentValue = newValue
      this.$emit('on-change', {value:newValue,id:this.dataid})
    },
    currentValue (val) {
      this.$emit('input', val)
    }
  },
  data () {
    return {
      currentValue: this.value
    }
  }
}
</script>

<style>
.vux-checker-item {
  display: inline-block;
}
</style>

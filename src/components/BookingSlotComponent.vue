<script>
export default{
  props:['bikeId','slotId','modelValue'],
  data(){
    return {
        result: '',
        isClicked: false,
        bgColor: ''
    }
  },
  watch:{
    modelValue(newVal){
        if(!this.isClicked && newVal){
            this.bgColor = 'grey'
            this.isClicked = true
        }
    }
  },
  computed:{
    inputStyle(){
        return `background-color: ${this.bgColor}`
    },
  },
  methods:{
    handleClick(){
        if(this.isClicked == false){
            this.isClicked = true
            this.bgColor = 'yellow'
            fetch(`http://localhost:3001/book?bikeId=${this.bikeId}&slotId=${this.slotId}`).then(res => res.text()).then(text=>{
                this.result = text
                if(this.result=='booked' && this.modelValue == false){
                    this.bgColor = 'green'
                    this.$emit('update:modelValue', true)
                }
                else if(this.result=='booked' && this.modelValue == true){
                    this.bgColor = 'red'
                }
                else if(this.result == 'rejected'){
                    this.bgColor = 'red'
                }
            })
        } 
    },
    
  }
}
</script>

<template>
    <div>
        <span :style="inputStyle" @click="handleClick">Bike:{{bikeId}} Slot:{{ slotId }}</span>
    </div>
    
</template>

<style>
</style>
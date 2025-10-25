<template>
  <div class="loader"></div>
</template>
<style scoped>
.loader {
  border: 5px solid #fff;
  border-bottom-color: #ff3d00;
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

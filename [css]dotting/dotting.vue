<template>
  <span class="dotting"></span>
</template>

<style scoped>
.dotting {
  display: inline-block;
  min-width: 2px;
  min-height: 2px;
  box-shadow: 2px 0 currentColor, 8px 0 currentColor, 14px 0 currentColor;
  animation: dot 1s infinite step-start both;
  border-radius: 100%;
}
.dotting::before {
  content: "";
}
:root .dotting {
  margin-right: 2em;
} /* IE9+,FF,CH,OP,SF */

@keyframes dot {
  25% {
    box-shadow: none;
  }
  50% {
    box-shadow: 2px 0 currentColor;
  }
  75% {
    box-shadow: 2px 0 currentColor, 8px 0 currentColor;
  }
}
</style>

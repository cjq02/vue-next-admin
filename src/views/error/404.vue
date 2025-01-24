<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/404_images/404.png" alt="404" />
        <img class="pic-404__child left" src="@/assets/404_images/404_cloud.png" alt="404" />
        <img class="pic-404__child mid" src="@/assets/404_images/404_cloud.png" alt="404" />
        <img class="pic-404__child right" src="@/assets/404_images/404_cloud.png" alt="404" />
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">OOPS!</div>
        <div class="bullshit__info">
          All rights reserved
          <a style="color: #20a0ff" href="https://wallstreetcn.com" target="_blank">wallstreetcn</a>
        </div>
        <div class="bullshit__headline">{{ message }}</div>
        <div class="bullshit__info">
          Please check that the URL you entered is correct, or click the button below to return to the homepage.
        </div>
        <a href="" class="bullshit__return-home">Back to home</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const message = computed(() => {
  return 'The webmaster said that you can not enter this page...'
})
</script>

<style lang="scss" scoped>
.wscn-http404-container {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
}
.wscn-http404 {
  overflow: hidden;
  position: relative;
  padding: 0 50px;
  width: 1200px;
  .pic-404 {
    overflow: hidden;
    float: left;
    position: relative;
    width: 600px;
    &__parent {
      width: 100%;
    }
    &__child {
      position: absolute;
      &.left {
        left: 220px;
        top: 17px;
        width: 80px;
        opacity: 0;
        animation-name: cloudLeft;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-delay: 1s;
        animation-fill-mode: forwards;
      }
      &.mid {
        left: 420px;
        top: 10px;
        width: 46px;
        opacity: 0;
        animation-name: cloudMid;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-delay: 1.2s;
        animation-fill-mode: forwards;
      }
      &.right {
        left: 500px;
        top: 100px;
        width: 62px;
        opacity: 0;
        animation-name: cloudRight;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-delay: 1s;
        animation-fill-mode: forwards;
      }
      @keyframes cloudLeft {
        0% {
          left: 220px;
          top: 17px;
          opacity: 0;
        }
        20% {
          left: 188px;
          top: 33px;
          opacity: 1;
        }
        80% {
          left: 92px;
          top: 81px;
          opacity: 1;
        }
        100% {
          left: 60px;
          top: 97px;
          opacity: 0;
        }
      }
      @keyframes cloudMid {
        0% {
          left: 420px;
          top: 10px;
          opacity: 0;
        }
        20% {
          left: 360px;
          top: 40px;
          opacity: 1;
        }
        70% {
          left: 180px;
          top: 130px;
          opacity: 1;
        }
        100% {
          left: 120px;
          top: 160px;
          opacity: 0;
        }
      }
      @keyframes cloudRight {
        0% {
          left: 500px;
          top: 100px;
          opacity: 0;
        }
        20% {
          left: 460px;
          top: 120px;
          opacity: 1;
        }
        80% {
          left: 340px;
          top: 180px;
          opacity: 1;
        }
        100% {
          left: 300px;
          top: 200px;
          opacity: 0;
        }
      }
    }
  }
  .bullshit {
    overflow: hidden;
    float: left;
    position: relative;
    padding: 30px 0;
    width: 300px;
    &__oops {
      margin-bottom: 20px;
      opacity: 0;
      line-height: 40px;
      font-weight: bold;
      font-size: 32px;
      color: #1482f0;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    &__headline {
      margin-bottom: 10px;
      opacity: 0;
      line-height: 24px;
      font-weight: bold;
      font-size: 20px;
      color: #222;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }
    &__info {
      margin-bottom: 30px;
      opacity: 0;
      line-height: 21px;
      font-size: 13px;
      color: grey;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }
    &__return-home {
      display: block;
      float: left;
      border-radius: 100px;
      width: 110px;
      height: 36px;
      background: #1482f0;
      opacity: 0;
      cursor: pointer;
      line-height: 36px;
      text-align: center;
      font-size: 14px;
      color: #fff;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }
    @keyframes slideUp {
      0% {
        opacity: 0;
        transform: translateY(60px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
}
</style>

<template>
  <transition name="ex-notification-fade">
    <div
      :class="['ex-notification', customClass, horizontalClass, type]"
      v-show="visible"
      :style="positionStyle"
      @mouseenter="clearTimer()"
      @mouseleave="startTimer()"
      @click="click"
      role="alert"
    >
      <div class="ex-notification-group" :class="{'is-width-icon': typeClass || iconClass}">
        <div class="close" @click.stop="close">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon_minor_closed"></use>
          </svg>
        </div>
        <h2 class="ex-notification-group-title">
          <!-- <svg v-if="type === 'info'" class="icon info" aria-hidden="true">
            <use xlink:href="#icon_minor_alret"></use>
          </svg>
          <svg v-if="type === 'warning'" class="icon warning" aria-hidden="true">
            <use xlink:href="#icon_minor_alret"></use>
          </svg>
          <svg v-if="type === 'success'" class="icon success" aria-hidden="true">
            <use xlink:href="#icon_minor_finish"></use>
          </svg>
          <svg v-if="type === 'error'" class="icon error" aria-hidden="true">
            <use xlink:href="#icon_minor_disable"></use>
          </svg> -->
          <img v-if="type === 'success'" class="icon" src="~/assets/img/icon/success-icon.png"/>
          <img v-if="type === 'error'" class="icon" src="~/assets/img/icon/error-icon.png"/>
          
          <span>{{title}}</span>
        </h2>
        <div class="ex-notification-content" v-show="message">
          <slot>
            <p v-if="!dangerouslyUseHTMLString">{{message}}</p>
            <p v-else v-html="message"></p>
          </slot>
        </div>
        <div
          class="el-notification-close-btn el-icon-close"
          v-if="showClose"
          @click.stop="close"
        ></div>
      </div>
    </div>
  </transition>
</template>
<script type="text/babel">
let typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
};

export default {
  name: 'ex-notification',
  data() {
    return {
      visible: false,
      title: '',
      message: '',
      duration: 4500,
      type: 'info',
      showClose: true,
      customClass: '',
      onClose: null,
      onClick: null,
      closed: false,
      verticalOffset: 0,
      timer: null,
      dangerouslyUseHTMLString: false,
      position: 'top-right'
    };
  },
  computed: {
    typeClass() {
      return this.type && typeMap[this.type] ? `ex-icon-${ typeMap[this.type]} ` : '';
    },
    iconClass() {
      switch(this.type) {
        case 'success':
          return '';
        case 'info':
          return '';
        case 'warning':
          return '';
        case 'error':
          return '';
        default:
          return '';
      }
    },
    horizontalClass() {
      return this.position.indexOf('right') > -1 ? 'right' : 'left';
    },
    verticalProperty() {
      return /^top-/.test(this.position) ? 'top' : 'bottom';
    },
    positionStyle() {
      return {
        [this.verticalProperty]: `${ this.verticalOffset }px`
      };
    }
  },
  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false;
        this.$el.addEventListener('transitionend', this.destroyElement);
      }
    },
    type(val) {
      console.log('type###val###', val);
    }
  },
  methods: {
    destroyElement() {
      this.$el.removeEventListener('transitioned', this.destroyElement);
      this.$destroy(true),
      this.$el.parentNode.removeChild(this.$el);
    },
    click() {
      if (typeof this.onClick === 'function') {
        this.onClick();
      }
    },
    close() {
      this.closed = true;
      if (typeof this.onClose === 'function') {
        this.onClose();
      }
    },
    clearTimer() {
      clearTimeout(this.timer);
    },
    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close();
          }
        }, this.duration);
      }
    },
    keydown(e) {
      /**
       * 46 Delete
       * 8 BackSpace
       * 27 esc
       */
      if (e.keyCode === 46 || e.keyCode === 8){
        this.clearTimer();
      } else if (e.keyCode === 27) {
        if (!this.closed) {
          this.close();
        }
      } else {
        this.startTimer(); //恢复倒计时
      }
    }
  },
  mounted() {
    if (this.duration > 0) {
      this.timer = setTimeout(() => {
        if (!this.closed) {
          this.close();
        }
      }, this.duration);
    }
    document.addEventListener('keydown', this.keydown);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydown);
  }
};
</script>
<style lang="scss">
@import "~/assets/css/base.scss";
.ex-notification {
  position: fixed;
  padding: 16px;
  width: 321px;
  color: #fff;
  border-left-width: 4px;
  border-left-style: solid;
  box-shadow:0px 12px 48px 16px rgba(0,0,0,0.12),0px 9px 28px 0px rgba(0,0,0,0.2),0px 6px 16px -8px rgba(0,0,0,0.32);
  transition: opacity .3s,transform .3s,left .3s,right .3s,top .4s,bottom .3s;
  /* @include themeify {
    background: themed('bg-line');
  } */
  background: #1D2C24;

  &.right {
    right: 16px;
  }
  &.left {
    left: 16px;
  }
  &.info {
    /* @include themeify {
      border-left-color: rgba(themed('color-info'), 0.4);
    } */
    border-left-color: $info-color;
  }
  &.warning {
    /* @include themeify {
      border-left-color: rgba(themed('color-warning'), 0.4);
    } */
    border-left-color: $warning-color;
  }
  &.success {
    /* @include themeify {
      border-left-color: rgba(themed('color-success'), 0.4);
    } */
    border-left-color: $success-color;
  }
  &.error {
    /* @include themeify {
      border-left-color: rgba(themed('color-error'), 0.4);
    } */
    border-left-color: $error-color;
  }
  .ex-notification-group {
    position: relative;
    .close {
      position: absolute;
      right: 0px;
      top: 0px;
      cursor: pointer;
      /* @include themeify {
        fill: themed('text-p');
      } */
    }
  }


  .ex-notification-group-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    /* @include themeify {
      color: themed('text-t');
    } */
    color: $text-m;
    .icon {
      margin-right: 12px;
      width: 20px;
      height: 20px;
      /* &.info {
        @include themeify {
          fill: themed('color-info');
        }
      }
      &.warning {
        @include themeify {
          fill: themed('color-warning');
        }
      }
      &.success {
        @include themeify {
          fill: themed('color-success');
        }
      }
      &.error {
        @include themeify {
          fill: themed('color-error');
        }
      } */
    }
  }
  .ex-notification-content {
    font-size: 12px;
    padding-left: 32px;
    margin-top: 8px;
    color: $text-t;
    /* @include themeify {
      color: themed('text-p');
    } */
  }

}
.ex-notification-fade-enter {
  &.right {
    right: 0;
    transform: translateX(100%);
  }

  &.left {
    left: 0;
    transform: translateX(-100%);
  }
}

.ex-notification-fade-leave-active {
  opacity: 0;
}
</style>

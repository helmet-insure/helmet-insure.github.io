<template>
  <transition name="ex-message-fade" @after-leave="handleAfterLeave">
    <div
      :class="[
        'ex-message',
        type && !iconClass ? `ex-message-${type}` : '',
        center ? 'is-center' : '',
        showClose ? 'is-closable' : '',
        customClass,
      ]"
      :style="positionStyle"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
      role="alert"
    >
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
      <img
        v-if="type === 'success'"
        class="icon"
        src="~/assets/img/icon/success-icon.png"
      />
      <img
        v-if="type === 'error'"
        class="icon"
        src="~/assets/img/icon/error-icon.png"
      />

      <div class="ex-message-content-box">
        <slot>
          <p v-if="!dangerouslyUseHTMLString" class="ex-message-content">
            {{ message }}
          </p>
          <p v-else v-html="message" class="ex-message-close"></p>
        </slot>
      </div>
      <div v-if="showClose" class="close" @click.stop="close">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon_minor_closed"></use>
        </svg>
      </div>
    </div>
  </transition>
</template>
<script>
const typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error',
};
export default {
  name: 'ex-message',
  data() {
    return {
      visible: false,
      message: '',
      duration: 3000,
      type: 'info',
      iconClass: '',
      customClass: '',
      onClose: null,
      showClose: false,
      closed: false,
      verticalOffset: 20,
      timer: null,
      dangerouslyUseHTMLString: false,
      center: false,
    };
  },
  computed: {
    typeClass() {
      return this.type && !this.iconClass
        ? `ex-message-icon el-icon-${typeMap[this.type]}`
        : '';
    },
    positionStyle() {
      return {
        top: `${this.verticalOffset}px`,
      };
    },
  },
  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false;
      }
    },
  },
  methods: {
    handleAfterLeave() {
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },
    close() {
      this.closed = true;
      if (typeof this.onClose === 'function') {
        this.onClose(this);
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
      if (e.keyCode === 27) {
        // esc关闭消息
        if (!this.closed) {
          this.close();
        }
      }
    },
  },
  mounted() {
    this.startTimer();
    document.addEventListener('keydown', this.keydown);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydown);
  },
};
</script>
<style lang="scss">
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .ex-message {
    width: 640px;
    padding: 8px 16px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    position: fixed;
    left: 50%;
    top: 20px;
    transform: translateX(-50%);
    transition: opacity 0.3s, transform 0.4s, top 0.4s;
    &.ex-message-info {
      /* @include themeify {
      background: rgba(themed('color-info'), 0.08);
    } */
    }
    &.ex-message-warning {
      /* @include themeify {
      background: rgba(themed('color-warning'), 0.08);
    } */
    }
    &.ex-message-success {
      /* @include themeify {
      background: rgba(themed('color-success'), 0.08);
    } */
      background: #e5f8e5;
    }
    &.ex-message-error {
      background: #ffefe5;
      /* @include themeify {
      background: rgba(themed('color-error'), 0.08);
    } */
    }
    .icon {
      width: 24px;
      height: 24px;
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
    .ex-message-content-box {
      flex: 1;
      margin-left: 12px;
    }
    .close {
      height: 20px;
      .icon {
        width: 20px;
        height: 20px;
        /* @include themeify {
        fill: themed('text-p');
      } */
      }
    }
  }

  .ex-message-fade-enter,
  .ex-message-fade-leave-active {
    opacity: 0;
    transform: translate(-50%, -100%);
  }
}
@media screen and (max-width: 750px) {
  .ex-message {
    width: 100%;
    padding: 8px 16px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    position: fixed;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    transition: opacity 0.3s, transform 0.4s, top 0.4s;
    &.ex-message-info {
      /* @include themeify {
      background: rgba(themed('color-info'), 0.08);
    } */
    }
    &.ex-message-warning {
      /* @include themeify {
      background: rgba(themed('color-warning'), 0.08);
    } */
    }
    &.ex-message-success {
      /* @include themeify {
      background: rgba(themed('color-success'), 0.08);
    } */
      background: #1d2c24;
    }
    &.ex-message-error {
      background: #471111;
      /* @include themeify {
      background: rgba(themed('color-error'), 0.08);
    } */
    }
    .icon {
      width: 24px;
      height: 24px;
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
    .ex-message-content-box {
      flex: 1;
      margin-left: 12px;
    }
    .close {
      height: 20px;
      .icon {
        width: 20px;
        height: 20px;
        /* @include themeify {
        fill: themed('text-p');
      } */
      }
    }
  }

  .ex-message-fade-enter,
  .ex-message-fade-leave-active {
    opacity: 0;
    transform: translate(-50%, -100%);
  }
}
</style>

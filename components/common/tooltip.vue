<template>
    <div class="tooltip">
        <div class="name">{{name}}</div>
        <div class="hint-box">
            <i class="hint-icon"></i>
            <div class="hint" :style="widthStyle">{{hint}}</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'p-tooltip',
    props: {
        hint: {
            type: String,
            default: ''
        },
        name: {
            type: [String, Number],
            default: ''
        },
        width: {
            type: String,
            default: '200px'
        }
    },
    computed: {
        widthStyle() {
            return {
                width: this.width
            };
        }
    }
}
</script>
<style lang="scss" scoped>
@import "~/assets/css/base.scss";
.tooltip {
    display: flex;
    align-items: center;
    .hint-box {
        position: relative;
        font-size: 0px;
        .hint-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url("../../assets/img/icon/info.png") center center no-repeat;
            background-size: 100% 100%;
            cursor: help;
            margin-left: 4px;
            &:hover {
                &+.hint {
                    display: block;
                }
            }
        }
        .hint {
            display: none;
            position: absolute;
            min-width: 200px;
            padding: 10px;
            border-radius: 4px;
            color: $text-g;
            background: $border;
            left: 50%;
            top: 24px;
            transform: translate(-50%, 0%);
            font-size: 12px;
            &::after {
                content: "";
                width: 0px;
                height: 0px;
                border: 6px solid transparent;
                border-bottom: 6px solid $border;
                position: absolute;
                left: 50%;
                transform: translate(-50%, 0%);
                top: -10px;
            }
        }
    }
}
</style>
<template>
    <div class='zoom-image'>
        <img :src='url' @click='imagePreview(url)' />
        <div id='tbody'></div>
    </div>
</template>
<script>
export default {
    data() {
        return {}
    },
    props: ['url'],
    methods: {
        imagePreview(src) {
            let body = document.querySelector('#tbody')
            let mask = document.createElement('div')
            let img = document.createElement('img')
            img.src = src+'&width=1000'
            mask.classList.add('mask')
            this.setStyle(mask, img)
            this.setEventListener(body, mask)
            img.onload = function() {
                mask.appendChild(img)
                body.appendChild(mask)
            }
        },
        setStyle(mask, img) {
            mask.style.position = 'fixed'
            mask.style.top = 0
            mask.style.left = 0
            mask.style.right = 0
            mask.style.bottom = 0
            mask.style.background = 'rgba(0,0,0,0.8)'
            mask.style.zIndex = '99'
            img.style.position = 'absolute'
            img.style.top = '50%'
            img.style.left = '50%'
            img.style.width = '100%'
            img.style.transform = 'translate(-50%, -50%)'
        },
        setEventListener(body, mask) {
            mask.addEventListener('click', function() {
                body.removeChild(mask)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.zoom-image {
    width: 80px;
    height: 80px;
    display: inline-block;

    img {
        width: 100%;
        height: 100%;
    }
}
</style>
import appleSvg from '../assets/apple.svg'

export const colors = Object.freeze({
    cellLight: '#6f6',
    cellDark: '#6e6',
    snakeBody: '#56c',
    snakeHead: '#50c',
})

export const imgs = Object.freeze({
    apple: appleSvg
})

/**
 * @param width cells per row
 * @param height cells per column
 * @param size cells size in px
*/
export class GameCanvas {
    constructor(width = 15, height = 15, size = 24) {
        this.canvas = document.querySelector('canvas#canvas')
        this.ctx = this.canvas.getContext('2d')

        this.size = size

        this.width = width
        this.height = height

        this.displayWidth = width * size
        this.displayHeight = height * size

        this.canvas.width = this.displayWidth
        this.canvas.height = this.displayHeight
        this.canvas.style.width = this.displayWidth + 'px'
        this.canvas.style.height = this.displayHeight + 'px'

        this._fillField()
    }

    draw(x, y, color = null, offsetX = 0, offsetY = 0) {
        const rect = new Path2D()
        rect.rect(x * this.size + offsetX, y * this.size + offsetY, this.size, this.size)

        this.ctx.fillStyle = color ? color : this.ctx.fillStyle
        this.ctx.fill(rect)
    }

    drawImage(x, y, src) {
        const img = new Image()
        img.src = src
        img.addEventListener('load', () => {
            const dx = x * this.size + 1
            const dy = y * this.size + 1
            this.ctx.drawImage(img, dx, dy, this.size - 2, this.size - 2)
        })
    }

    _fillField() {
        let isOdd = true

        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                this.ctx.fillStyle = isOdd ? colors.cellDark : colors.cellLight
                this.ctx.fillRect(x * this.size, y * this.size, this.size, this.size)

                isOdd = !isOdd
            }
        }
    }

    clear(x, y) {
        if(x % 2 === 0 && y % 2 === 0) {
            this.ctx.fillStyle = colors.cellDark
        } else if(x % 2 === 0 && y % 2 != 0) {
            this.ctx.fillStyle = colors.cellLight
        } else if(x % 2 != 0 && y % 2 === 0) {
            this.ctx.fillStyle = colors.cellLight
        } else {
            this.ctx.fillStyle = colors.cellDark
        }

        this.ctx.fillRect(x * this.size, y * this.size, this.size, this.size)
    }
}
import { dirs } from "./game"

export class Part {
    constructor(x, y, direction) {
        this.x = x
        this.y = y
        this.dir = direction
    }

    move(dir = this.dir) {
        switch (dir) {
            case dirs.up:
                this.y -= 1
                break

            case dirs.down:
                this.y += 1
                break

            case dirs.right:
                this.x += 1
                break

            case dirs.left:
                this.x -= 1
                break
        }
    }

    static getClone(part) {
        return new Part(part.x, part.y, part.dir)
    }
}
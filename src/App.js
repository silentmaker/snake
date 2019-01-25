import React, { Component } from 'react'
import * as p5 from 'p5'
import initReactFastclick from "react-fastclick";
import './App.css'

const defaultSnake = () => ({
  x: 1,
  y: 1,
  xspeed: 1,
  yspeed: 0,
  bodies: [],
  length: 0
})

class App extends Component {
  constructor(props) {
    super(props)

    this.state = { isOver: false }
    this.painter = null
    this.width = Math.min(window.innerWidth, window.innerHeight, 600)
    this.columns = 36
    this.snake = defaultSnake()
    this.food = {x: 0, y: 0}
    this.orientation = ''
    this.gridSize = this.width / this.columns
    this.speedLevel = 8
    this.speedCount = 0

    this.setup = this.setup.bind(this)
    this.draw = this.draw.bind(this)
    this.keyPressed = this.keyPressed.bind(this)
    this.turn = this.turn.bind(this)
    this.over = this.over.bind(this)
    this.restart = this.restart.bind(this)
  }
  componentDidMount() {
    initReactFastclick()

    new p5((p) => {
      this.painter = p;
      p.setup = this.setup
      p.draw = this.draw
    }, document.getElementById('snake-game'))

    document.onkeydown = this.keyPressed
  }
  setup() {
    this.painter.frameRate(60)
    this.painter.createCanvas(this.width, this.width)
    this.createFood()
  }
  draw() {
    if (this.speedCount < this.speedLevel) {
      this.speedCount += 1;
      return;
    } else {
      this.speedCount = 0;
    }

    const {painter, snake, food, gridSize, columns} = this
    const nextX = snake.x + snake.xspeed
    const nextY = snake.y + snake.yspeed

    if (nextX < 0 || nextY < 0 || nextX >= columns || nextY >= columns) this.over()

    painter.background('#E2E1DD')
    painter.fill('#3D9DA5')
    painter.rect(snake.x * gridSize, snake.y * gridSize, gridSize, gridSize)
    for (let i = 0; i < snake.bodies.length; i++) {
      if (nextX === snake.bodies[i].x && nextY === snake.bodies[i].y) this.over()
      painter.rect(snake.bodies[i].x * gridSize, snake.bodies[i].y * gridSize, gridSize, gridSize)
    }
    painter.fill('#BB7F3B')
    painter.rect(food.x * gridSize, food.y * gridSize, gridSize, gridSize)

    if (snake.x === food.x && snake.y === food.y) {
      snake.length += 1
      if (this.speedLevel > 2) this.speedLevel -= 1
      this.createFood()
    }

    snake.bodies.unshift({x: snake.x, y: snake.y})
    if (snake.bodies.length > snake.length) {
      snake.bodies.pop()
    }

    snake.x = nextX
    snake.y = nextY
  }
  createFood() {
    const {painter, food, columns} = this

    food.x = painter.floor(painter.random(1, columns - 1))
    food.y = painter.floor(painter.random(1, columns - 1))
  }
  keyPressed(e) {
    const {turn} = this;
    window.navigator.vibrate([200])
    switch (e.keyCode) {
      case 38:
        turn(e, 'up')
        break
      case 40:
        turn(e, 'down')
        break
      case 37:
        turn(e, 'left')
        break
      case 39:
        turn(e, 'right')
        break
      default:
        break
    }
  }
  turn(e, dir) {
    if (e.type === 'click' && 'ontouchstart' in document.documentElement) return;
    e.stopPropagation();
    const {snake} = this
    const xspeed = dir === 'left' ? -1 : (dir === 'right' ? 1 : 0)
    const yspeed = dir === 'up' ? -1 : (dir === 'down' ? 1 : 0)

    if (xspeed !== -snake.xspeed || yspeed !== -snake.yspeed) {
      snake.xspeed = xspeed
      snake.yspeed = yspeed
    }
  }
  over() {
    this.painter.noLoop()
    window.navigator.vibrate([200])
    this.setState({ isOver: true })
  }
  restart() {
    this.snake = defaultSnake()
    this.speedLevel = 8
    this.speedCount = 0
    this.painter.loop()
    this.setState({ isOver: false })
  }
  componentWillUnmount() {
    document.onkeydown = null
  }
  render() {
    const {turn, width, restart} = this
    const {isOver} = this.state
    const containerStyle = {width: width + 'px'}

    return (
      <div>
        <div id="snake-game" style={containerStyle}></div>
        {isOver ? 
        <div id="game-over">
          <div className="over">GAME OVER!</div>
          <div className="restart" onClick={restart}>RESTART</div>
        </div> :  
        <div id="controls">
          <div className="control up"
            onTouchStart={(e) => turn(e, 'up')}
            onClick={(e) => turn(e, 'up')}></div>
          <div className="control left"
            onTouchStart={(e) => turn(e, 'left')}
            onClick={(e) => turn(e, 'left')}></div>
          <div className="control right"
            onTouchStart={(e) => turn(e, 'right')}
            onClick={(e) => turn(e, 'right')}></div>
          <div className="control down"
            onTouchStart={(e) => turn(e, 'down')}
            onClick={(e) => turn(e, 'down')}></div>
        </div>
        }
      </div>
    )
  }
}

export default App

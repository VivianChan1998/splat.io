import React from 'react';
import './Game.css';
import { drawPlayer, drawField, drawSplat } from '../draw'

import { GAME_STATE, PLAYER_STATUS } from '../enum'
import {
    getKeyUpState,
    getKeyDownState,
    getMousePos,
    calculatePlayerAngle,
    updatePlayerPosition,
    getSplats,
} from '../utils'

class Game extends React.Component {

    constructor(props) {
        super(props);
        var mouseScale = 1;
        this.state = {
            gameBoardWidth: 1600,
            gameBoardHeight: 900,
            cameraSize: 1000,

            gameState: GAME_STATE.GAMING,

            //player info
            playerName: "player",
            playerColor: "#ff6666",
            playerHealth: 100,
            playerPosition: { x: 100, y: 100 },
            playerAngle: 0,
            playerStatus: PLAYER_STATUS.STANDING,
            playerMoveSpeed: 5,
            playerMoveDirection: { x: 0, y: 0 },
            playerEquipment: {
                mainWeapon: 0,
                sideWeapon: 0,
                items: [],
            },

            keyStrokeState: { left: 0, right: 0, up: 0, down: 0, space: 0, g: 0 },
            mousePosition: { x: 0, y: 0 },
            mouseClient: { x: 0, y: 0 },
            mouseDownState: 0,
        }
    }

    onKeyDown = e => {
        const new_State = getKeyDownState(e, this.state);
        this.setState(new_State);
    }

    onKeyUp = e => {
        const new_State = getKeyUpState(e, this.state);
        this.setState(new_State);
    }

    trackMouse = e => {
        var mouseClient = getMousePos(e);
        this.setState({ mouseClient: mouseClient })
    }

    mouseDown = e => {
        this.setState({ mouseDownState: 1 });
    }
    mouseUp = e => {
        this.setState({ mouseDownState: 0 });
    }

    updateGame = () => {
        // measure screen scale
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        this.mouseScale = windowWidth > windowHeight ? this.state.cameraSize / windowWidth : this.state.cameraSize / windowHeight;
        
        // get and set mouse position
        var canvas = this.groundRef;
        var rect = canvas.getBoundingClientRect();
        this.setState({ mousePosition: { x: (this.state.mouseClient.x - rect.left) * this.mouseScale, y: (this.state.mouseClient.y - rect.top) * this.mouseScale } });
        
        // get and set player angle
        const playerAngle = calculatePlayerAngle(this.state.playerPosition.x, this.state.playerPosition.y, this.state.mousePosition.x, this.state.mousePosition.y)
        this.setState({ playerAngle: playerAngle })

        // get player position
        const new_playerPosition = updatePlayerPosition(this.state.gameState, this.state.playerPosition, this.state.playerMoveDirection, this.state.playerMoveSpeed);
        this.setState({ new_playerPosition });
        //draw filed
        drawField(this.fieldRef);

        // draw splat if clicked
        if (this.state.mouseDownState === 1) {
            const splat = getSplats(this.state);
            drawSplat(this.splatRef, splat, this.state.playerColor);
        }

        //draw player 
        drawPlayer(this.playerRef, this.state);
    }

    componentDidMount = () => {
        window.addEventListener("keyup", this.onKeyUp);
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("mousemove", this.trackMouse);
        window.addEventListener("mousedown", this.mouseDown);
        window.addEventListener("mouseup", this.mouseUp);

        setInterval(() => {
            this.updateGame();
        }, 20);
    }

    render() {
        return (
            <svg id="svg-container"
                width={Math.max(window.innerWidth, window.innerHeight)}
                height={Math.max(window.innerWidth, window.innerHeight)}
                preserveAspectRatio="xMidYMid slice"
                viewBox={
                    [this.state.cameraSize / -2 + this.state.playerPosition.x,
                    this.state.cameraSize / -4 + this.state.playerPosition.y,
                    this.state.cameraSize,
                    this.state.cameraSize]}>
                <foreignObject x="0" y="0" width="10000" height="10000">
                    <canvas id="groundLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.groundRef = el} />
                    <canvas id="splatLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.splatRef = el} />
                    <canvas id="splatAnimationLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.splatAnimationRef = el} />
                    <canvas id="fieldLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.fieldRef = el} />
                    <canvas id="playerLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.playerRef = el} />
                    <canvas id="itemLayer" width={this.state.gameBoardWidth} height={this.state.gameBoardHeight} ref={el => this.itemRef = el} />
                </foreignObject>
            </svg>
        );
    }
}

export default Game;


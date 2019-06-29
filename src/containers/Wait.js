import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './Wait.css'
import UserBlock from '../components/UserBlock'
import { COLOR_ASSET } from '../components/ColorAssets'

class Wait extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teamA: [],
            teamB: [],
            isRoomFull: [],
            teamAColor: COLOR_ASSET[this.props.teamColor['A']].shadow,
            teamBColor: COLOR_ASSET[this.props.teamColor['B']].shadow,
            waitTime: 10,
            waitingMessage: ''
        }

        this.props.socket.emit('getRoomPlayers', {
            roomId: this.props.roomId
        });

        this.props.socket.on('getRoomPlayers', (data) => {
            let waitingForPlayer = data.maxPlayers - data.teamA.length - data.teamB.length;

            this.setState({
                teamA: data.teamA.map(p => p.name),
                teamB: data.teamB.map(p => p.name),
                isRoomFull: data.isRoomFull,
                maxPlayers: data.maxPlayers,
                waitTime: data.waitTime,
                waitingMessage: `waiting for ${waitingForPlayer} more players to join...`
            });
        });
        
        this.props.socket.on('getWaitTime', (data) => {
            this.setState({
                waitTime: data.waitTime,
                waitingMessage: `left ${data.waitTime} seconds to begin...`
            })
            if (data.waitTime <= 0) {
                this.props.socket.off('getWaitTime');
            }
        })

        this.props.socket.once('startGaming', () => {
            this.props.history.push(`/game/${this.props.roomId}`);
        })
    }

    handleBack = () => {
        this.props.socket.disconnect();
        this.props.socket.open()
        this.props.history.push('/home');
        this.props.setName();
    }

    render() {
        let teamA = this.state.teamA.map(name =>
            <li key={name}>
                <UserBlock userName={name} team='A' />
            </li>
        );

        let teamB = this.state.teamB.map(name =>
            <li key={name}>
                <UserBlock userName={name} team='B' />
            </li>
        );

        return (
            <div className='Wait_container'>
                <h1>Game Lobby</h1>
                <h3 id='Wait_message'>{this.state.waitingMessage}</h3>
                <div id='Wait_wrapper'>
                    <div className='Wait_group' style={{background: this.state.teamAColor}} >
                        <h3 className='Wait_grouptitle' >TEAM A</h3>
                        <ul>
                            {teamA}
                        </ul>
                    </div>
                    <div className='Wait_group' style={{background: this.state.teamBColor}}>
                        <h3>TEAM B</h3>
                        <ul>
                            {teamB}
                        </ul>
                    </div>
                </div>
                <div id='Wait_button'>
                    <button className='App_button' onClick={this.handleBack}>
                        Back
                    </button>
                </div>
            </div>

        )
    }
}

export default Wait
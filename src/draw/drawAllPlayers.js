import { drawPlayer, drawSplat, drawBullet, } from '../draw'

export const drawAllPlayers = (splatRef, bulletRef, playerRef, splatAnimationRef, players, p_x, p_y, team) => {
    // var splatRefContext = splatRef.getContext("2d");
    // splatRefContext.clearRect(0, 0, splatRef.width, splatRef.height);

    var bulletRefContext = bulletRef.getContext("2d");
    bulletRefContext.clearRect(0, 0, bulletRef.width, bulletRef.height);

    var playerRefContext = playerRef.getContext("2d");
    playerRefContext.clearRect(0, 0, playerRef.width, playerRef.height);

    var splatAnimationRefContext = splatAnimationRef.getContext("2d");
    splatAnimationRefContext.clearRect(0, 0, splatAnimationRef.width, splatAnimationRef.height);

    // context.clearRect(0, 0, c.width, c.height);

    var l = players.length
    var isTeamMate = 0;
    for (var p = 0; p < l; ++p) {
        if(players[p].playerTeam === team) isTeamMate = 1;
        drawPlayer(playerRef, splatAnimationRef, players[p], (p === l-1)? 1:0 , isTeamMate);
        // drawSplat(this.splatRef, this.splatAnimationRef, this.playerData.splats, this.playerData.playerColor, this.playerData.playerAngle, this.playerData.playerPosition);
        drawSplat(splatRef, splatAnimationRef, players[p].splats, players[p].playerColor,  players[p].playerAngle,  players[p].playerPosition, p_x, p_y);

        // drawBullet(this.bulletRef, this.playerData.bullets, this.playerData.playerColor);
        drawBullet(bulletRef,  players[p].bullets, players[p].playerColor, p_x, p_y);
    }
}  

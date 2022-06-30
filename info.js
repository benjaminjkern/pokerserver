var renderInfo;
(() => {
    renderInfo = (games, players) => {
        document.getElementById("info").innerHTML = `Total games: ${
            games.length
        }<br>Total players: ${
            Object.keys(players).length
        }<br>Total money laundered: ${formatMoney(
            games.reduce((p, game) => p + game.buyin * game.players.length, 0)
        )}`;
    };
})();

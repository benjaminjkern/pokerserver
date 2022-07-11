var renderInfo;
window.addEventListener("load", () => {
    renderInfo = (games, players) => {
        document.getElementById("info").innerHTML = `Total games: ${
            games.length
        }<br>Total players: ${
            Object.keys(players).length
        }<br>Total money laundered: ${formatMoney(
            games.reduce(
                (p, game) =>
                    p +
                    game.buyin *
                        game.players.reduce(
                            (p, player) => p + player.split("/").length,
                            0
                        ),
                0
            )
        )}`;
    };
});

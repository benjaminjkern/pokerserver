var renderInfo;
window.addEventListener("load", () => {
    renderInfo = (games, players) => {
        const hiddenPlayers = Object.keys(players)
            .map((name) => players[name])
            .filter((player) => player.games < minGames).length;
        document.getElementById("info").innerHTML = `Total games: ${
            games.length
        }<br>Total players: ${Object.keys(players).length}${
            hiddenPlayers ? `(${hiddenPlayers} hidden)` : ""
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
        )}${
            games[games.length - 1].quote
                ? (() => {
                      const [quote, author = "anonymous"] =
                          games[games.length - 1].quote.split(/\s*-\s*/g);
                      return `<br>Quote of the night: "${quote}" - ${author}`;
                  })()
                : ""
        }`;
    };
});

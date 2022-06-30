window.onload = async () => {
    const gamesString = await fetch("/games/2022.csv").then((response) =>
        response.text()
    );
    const games = gamesString
        .split(/\r?\n/g)
        .filter((line) => line[0] !== "#")
        .map((game, gameNum) => {
            const [players, buyin] = game.split(/\s*;\s*/g);
            if (players.length === 0) return;
            return {
                gameNum,
                players: players
                    .split(/\s*,\s*/g)
                    .map((player) => player.toLowerCase()),
                buyin: +buyin,
            };
        });

    const players = parseGames(games);

    renderTable(players);
    // const request = new XMLHttpRequest();
    // request.open("GET", "/games/2021.csv", true);
    // request.responseType = "text";
    // request.onload = (...h) => {
    //     console.log(h);
    // };
    // request.send();
};

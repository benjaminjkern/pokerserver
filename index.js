window.onload = () => {
    const availableYears = ["2021", "2022"];
    const reloadTable = async (year) => {
        document
            .getElementById("year-selector")
            .querySelectorAll("div")
            .forEach((node) => {
                node.classList.remove("selected");
            });

        let fetchYears = availableYears;
        if (availableYears.includes(year)) {
            fetchYears = [year];
            document.getElementById(`year-${year}`).classList.add("selected");
        } else {
            document.getElementById("show-all").classList.add("selected");
        }

        const games = await Promise.all(fetchYears.map(fetchYear)).then(
            (yearGames) => yearGames.flat()
        );
        const players = parseGames(games);

        renderInfo(games, players);
        renderTable(players, undefined, false);
    };
    const fetchYear = async (year) => {
        const gamesString = await fetch(`games/${year}.csv`).then((response) =>
            response.text()
        );
        return gamesString
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
    };
    /** Make years */
    for (const year of availableYears) {
        const yearElement = document.createElement("div");
        yearElement.id = `year-${year}`;
        yearElement.innerHTML = year;
        yearElement.onclick = () => reloadTable(year);
        document.getElementById("year-selector").prepend(yearElement);
    }
    document.getElementById("show-all").onclick = () => reloadTable();

    reloadTable(availableYears[availableYears.length - 1]);
};

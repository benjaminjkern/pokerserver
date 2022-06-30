var renderTable;

(() => {
    let PLAYERS;
    let sortingBy;
    let reversingSort;

    renderTable = (players, sortedBy = 2) => {
        PLAYERS = [...Object.keys(players).map((name) => players[name])];
        if (sortedBy === sortingBy) {
            reversingSort = !reversingSort;
        } else {
            reversingSort = false;
        }
        sortingBy = sortedBy;

        PLAYERS.sort((a, b) =>
            (unpackPlayer(b)[sortedBy] > unpackPlayer(a)[sortedBy]) ^
            reversingSort ^
            (sortedBy === 0)
                ? 1
                : -1
        );
        const table = document.getElementById("table");
        table.innerHTML = "";
        renderRow(
            table,
            {
                name: "Name",
                profit: "Profit",
                score: "Score",
                games: "Games",
                wins: "Wins",
                draws: "Draws",
                losses: "Losses",
                bestHand: "",
                secondBestHand: "",
                thirdBestHand: "",
            },
            true
        );
        for (const player of PLAYERS) {
            renderRow(table, player);
        }
    };

    const unpackPlayer = (player) => {
        const { name, profit, score, games, wins, draws, losses } = player;
        return [name, profit, score, games, wins, draws, losses];
    };

    const renderRow = (table, player, topRow) => {
        for (const [i, element] of unpackPlayer(player).entries()) {
            const cell = document.createElement("div");
            if (i === 2 && !topRow) {
                cell.innerHTML = element.toFixed(2);
            } else if (i === 1 && !topRow) {
                cell.innerHTML = formatMoney(element);
            } else {
                cell.innerHTML = element;
            }
            if (topRow) {
                cell.classList.add("toprow");
                cell.onclick = () => {
                    renderTable(PLAYERS, i);
                };
                if (i === sortingBy) {
                    cell.innerHTML += `<span>${
                        reversingSort ? "&#9650;" : "&#9660;"
                    }</span>`;
                }
            }
            if (i === sortingBy) cell.classList.add("selected");
            if (i % 2 === 0) cell.classList.add("odd");
            if (i === 0) cell.classList.add("first-child");
            if (i === 6) cell.classList.add("last-child");
            table.appendChild(cell);
        }
    };

    const formatMoney = (value) => {
        if (value < 0) return `-${formatMoney(-value)}`;
        const [integer, decimal] = value.toFixed(2).split(".");
        return `$${commify(integer)}.${decimal}`;
    };

    const commify = (integer) => {
        if (integer.length < 4) return integer;
        return `${commify(
            integer.substring(0, integer.length - 3)
        )},${integer.substring(integer.length - 3)}`;
    };
})();

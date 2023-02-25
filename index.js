import { parseGames } from "./src/elo.js";
import { renderInfo } from "./src/info.js";
import { games, minGames, setGames, setMinGames } from "./src/games.js";
import { renderTable } from "./src/table.js";
import "./src/graph.js";

window.onload = () => {
    const availableYears = ["2021", "2022", "2023"];
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

        setGames(
            await Promise.all(fetchYears.map(fetchYear)).then((yearGames) =>
                yearGames.flat()
            )
        );
        parseAndRender();
    };

    const parseAndRender = () => {
        setMinGames(
            Math.max(1, Math.min(minGames, Math.floor(games.length / 2)))
        );
        document.getElementById("mingames").innerText = minGames;

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
            .filter((line) => line && line[0] !== "#")
            .map((game, gameNum) => {
                const [players, buyin, quote] = game.split(/\s*;\s*/g);
                if (players.length === 0) return;
                return {
                    gameNum,
                    players: players
                        .split(/\s*,\s*/g)
                        .map((player) => player.toLowerCase()),
                    buyin: +buyin,
                    quote,
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

    /** Min games */
    document.getElementById("minus").onclick = () => {
        setMinGames(minGames - 1);
        parseAndRender();
    };
    document.getElementById("plus").onclick = () => {
        setMinGames(minGames + 1);
        parseAndRender();
    };
};

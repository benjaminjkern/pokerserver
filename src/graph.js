import { parseGames } from "./elo.js";
import { games, minGames } from "./games.js";
import { colors } from "./table.js";
import { capitalize, rankString } from "./utils.js";

const graphcontainer = document.getElementById("graphcontainer");
const graph = document.getElementById("graph");
const ctx = graph.getContext("2d");

let graphOpen = false;

window.addEventListener("resize", () => {
    if (graphOpen) makeGraph();
});

export const makeScoreGraph = () => {
    setGraphOpen(true);
    let min = 1000,
        max = 1000;
    const playersPerGame = games.map((_, g) => {
        const subgames = games.slice(0, g + 1);
        const players = parseGames(subgames);
        const scores = Object.keys(players).map((name) => players[name].score);

        min = Math.min(min, ...scores);
        max = Math.max(max, ...scores);
        return players;
    });
    const minint = Math.floor(min / 100);
    const maxint = Math.ceil(max / 100);
    const rangeint = maxint - minint;

    graph.width = window.innerWidth - 80;
    graph.height = window.innerHeight - 80;

    ctx.font = "20px serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    // draw grid
    const dy = (graph.height - 80) / rangeint;
    const dx = (graph.width - 80) / (playersPerGame.length + 1);
    ctx.beginPath();
    ctx.rect(40, 40, graph.width - 80 - dx, graph.height - 80);
    for (let i = 0; i <= rangeint; i++) {
        ctx.moveTo(40, 40 + i * dy);
        ctx.lineTo(graph.width - 40 - dx, 40 + i * dy);
        ctx.fillText((maxint - i) * 100, 40, 40 + i * dy);
    }
    for (let i = 1; i < playersPerGame.length; i++) {
        ctx.moveTo(40 + i * dx, 40);
        ctx.lineTo(40 + i * dx, graph.height - 40);
    }
    ctx.stroke();
    const allPlayers = playersPerGame[playersPerGame.length - 1];

    ctx.textAlign = "left";
    const boxHeight = 20;
    const boxMargin = 10;
    let p = 0;
    const sortedPlayers = Object.keys(allPlayers).sort(
        (a, b) => allPlayers[b].score - allPlayers[a].score
    );
    for (const player of sortedPlayers) {
        ctx.fillStyle = colors[player];
        ctx.fillRect(
            graph.width - 40 + boxMargin - dx,
            40 + p * (boxHeight + boxMargin),
            boxHeight,
            boxHeight
        );
        ctx.fillStyle = "black";
        ctx.fillText(
            player[0].toUpperCase() + player.substring(1),
            graph.width - 40 + 2 * boxMargin + boxHeight - dx,
            50 + p * 30
        );

        p++;
        ctx.beginPath();
        ctx.strokeStyle = colors[player];
        ctx.lineWidth = 5;
        ctx.moveTo(40, 40 + (10 - minint) * dy);
        for (let i = 0; i < playersPerGame.length; i++) {
            const players = playersPerGame[i];
            const score = players[player]?.score || 1000;
            ctx.lineTo(40 + (i + 1) * dx, 40 + (maxint - score / 100) * dy);
        }
        ctx.stroke();
    }
};

export const makeGraph = () => {
    setGraphOpen(true);
    const playersPerGame = games.map((_, g) => {
        const subgames = games.slice(0, g + 1);
        const players = parseGames(subgames);

        const sortedPlayers = Object.keys(players).map((name) => players[name]);
        sortedPlayers.sort((a, b) => b.score - a.score);

        return sortedPlayers;
    });
    const totalGames = playersPerGame[playersPerGame.length - 1].reduce(
        (p, { name, games }) => ({ ...p, [name]: games }),
        {}
    );
    playersPerGame.forEach((game, g) => {
        playersPerGame[g] = game.filter(
            (player) => totalGames[player.name] >= minGames
        );
    });

    graph.width = window.innerWidth - 80;
    graph.height = window.innerHeight - 80;

    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, graph.width, graph.height);

    ctx.font = "900 20px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    // draw grid

    const allPlayers = playersPerGame[playersPerGame.length - 1];

    ctx.lineCap = "round";
    const boxHeight = 20;
    const boxMargin = 10;
    const nameMargin = 100;
    const rankMargin = 50;

    const dx =
        (graph.width - 80 - nameMargin - rankMargin) /
        (playersPerGame.length - 1);
    const dy =
        boxHeight +
        (1 / (allPlayers.length - 1)) *
            (graph.height - 80 - allPlayers.length * boxHeight);

    // Draw lines
    for (const p in allPlayers) {
        ctx.beginPath();
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 2;
        ctx.moveTo(40 + rankMargin, 50 + p * dy);
        ctx.lineTo(
            40 + rankMargin + dx * (playersPerGame.length - 1),
            50 + p * dy
        );
        ctx.stroke();
    }

    for (const [p, player] of allPlayers.entries()) {
        // Draw player box
        ctx.beginPath();
        ctx.fillStyle = colors[player.name.toLowerCase()];
        ctx.arc(
            graph.width - 40 - nameMargin,
            50 + p * dy,
            boxHeight / 2,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.fillText(
            capitalize(player.name),
            graph.width - 40 + 2 * boxMargin - nameMargin,
            51 + p * dy
        );
        ctx.textAlign = "right";
        ctx.fillText(rankString(p + 1), 30 + rankMargin, 51 + p * dy);

        ctx.beginPath();

        ctx.strokeStyle = colors[player.name.toLowerCase()];
        ctx.lineWidth = 8;
        let inGames = false;
        for (const [g, game] of playersPerGame.entries()) {
            let ranking = game.findIndex(
                (gPlayer) => gPlayer.name === player.name
            );
            if (ranking === -1) continue;
            const newPos = [40 + g * dx + rankMargin, 50 + ranking * dy];
            if (!inGames) {
                inGames = true;
                ctx.moveTo(...newPos);
            } else {
                ctx.lineTo(...newPos);
            }
        }
        ctx.stroke();
    }
};

document.getElementById("opengraph").onclick = () => {
    makeGraph();
};
document.getElementById("graphcontainer").onclick = function (e) {
    if (e.target !== this) return;
    setGraphOpen(false);
};
document.getElementById("closegraph").onclick = () => {
    setGraphOpen(false);
};

const setGraphOpen = (value) => {
    graphOpen = value;
    graphcontainer.style.display = graphOpen ? "block" : "none";
};

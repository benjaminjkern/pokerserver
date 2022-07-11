let makeGraph;

window.addEventListener("load", () => {
    const graphcontainer = document.getElementById("graphcontainer");
    const graph = document.getElementById("graph");
    const ctx = graph.getContext("2d");

    let graphOpen = false;

    window.addEventListener("resize", () => {
        if (graphOpen) makeGraph();
    });
    let graphMode = 0;
    makeGraph = () => {
        setGraphOpen(true);
        let min = 1000,
            max = 1000;
        const playersPerGame = games.map((_, g) => {
            const subgames = games.slice(0, g + 1);
            const players = parseGames(subgames);
            const scores = Object.keys(players).map(
                (name) => players[name].score
            );

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
        for (const player in allPlayers) {
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

    document.getElementById("opengraph").onclick = () => {
        makeGraph();
    };
    document.getElementById("closegraph").onclick = () => {
        setGraphOpen(false);
    };

    const setGraphOpen = (value) => {
        graphOpen = value;
        graphcontainer.style.display = graphOpen ? "block" : "none";
    };
});

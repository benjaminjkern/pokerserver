var parseGames;

(() => {
    const START_SCORE = 1000;
    const ALPHA = 1;
    const BASE = 10;
    const FACTOR = 400;

    const P = (player1, player2) =>
        1 / (1 + BASE ** ((player1.score - player2.score) / FACTOR));

    const makeAdjustments = (losers, winners, weight) => {
        const losersDelta = losers.map(() => 0);
        const winnersDelta = winners.map(() => 0);
        // wins/losses
        for (const [w, winner] of winners.entries()) {
            for (const [l, loser] of losers.entries()) {
                const expected = P(loser, winner);
                const delta = (ALPHA * weight * expected) / winners.length;
                losersDelta[l] -= delta;
                winnersDelta[w] += delta;
            }
        }
        // ties
        for (const [l, loser] of losers.entries()) {
            for (const [o, otherLoser] of losers.slice(1).entries()) {
                const expected = P(loser, otherLoser);
                const delta =
                    (ALPHA * weight * (expected - 0.5)) / losers.length;
                losersDelta[l] -= delta;
                losersDelta[o] += delta;
            }
        }

        for (const [w, winner] of winners.entries()) {
            winner.score += winnersDelta[w];
        }
        for (const [l, loser] of losers.entries()) {
            loser.score += losersDelta[l];
        }
    };

    const playGame = (orderOut, buyin, players) => {
        const playersInGame = orderOut.flatMap((name) => name.split("/"));
        playersInGame.forEach((name) => {
            if (players[name]) return;
            players[name] = {
                name: name.substring(0, 1).toUpperCase() + name.substring(1),
                profit: 0,
                score: START_SCORE,
                games: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                bestHand: "",
                secondBestHand: "",
                thirdBestHand: "",
            };
        });

        const playerBuyins = playersInGame.reduce(
            (p, c) => ({ ...p, [c]: (p[c] || 0) + 1 }),
            {}
        );

        for (const name in playerBuyins) {
            const player = players[name];
            player.games++;
            player.losses++;
            player.profit -= buyin * playerBuyins[name];
        }

        const winners = orderOut[orderOut.length - 1]
            .split("/")
            .map((name) => players[name]);

        winners.forEach((winner) => {
            winner.losses--;
            if (winners.length >= 3)
                winner.losses += (winners.length - 2) / winners.length;
            winner.wins += 1 / winners.length;
            if (winners.length >= 2) winner.draws += 1 / winners.length;

            winner.profit += (buyin * (orderOut.length - 1)) / winners.length;
        });

        if (winners.length === 1) {
            const secondPlaces = orderOut[orderOut.length - 2]
                .split("/")
                .map((name) => players[name]);
            secondPlaces.forEach((secondPlace) => {
                secondPlace.losses--;

                if (secondPlaces.length >= 2)
                    secondPlace.losses +=
                        (secondPlaces.length - 1) / secondPlaces.length;
                secondPlace.draws += 1 / secondPlaces.length;
                secondPlace.profit += buyin / secondPlaces.length;
            });
        }

        for (const name of orderOut) {
            const names = name.split("/");
            names.forEach((name) => playerBuyins[name]--);
            makeAdjustments(
                names.map((name) => players[name]),
                Object.keys(playerBuyins)
                    .filter(
                        (player) =>
                            playerBuyins[player] > 0 && !names.includes(player)
                    )
                    .map((playerName) => players[playerName]),
                buyin
            );
        }
    };

    parseGames = (games) => {
        const players = {};
        for (const { players: orderOut, buyin } of games) {
            playGame(orderOut, buyin, players);
        }
        return players;
    };
})();

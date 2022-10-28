var parseGames;

(() => {
    const START_SCORE = 1000;
    const ALPHA = 1;
    const BASE = 10;
    const FACTOR = 400;

    // probability that player 2 is going to beat player 1
    const P = (player1, player2) =>
        1 / (1 + BASE ** ((player1.score - player2.score) / FACTOR));

    const makeAdjustments = (losers, winners, weight) => {
        const losersDelta = losers.map(() => 0);
        const losersIndividual = losers.map(() => 0);
        const winnersDelta = winners.map(() => 0);
        const winnersIndividual = winners.map(() => 0);

        // wins/losses
        for (const [w, winner] of winners.entries()) {
            for (const [l, loser] of losers.entries()) {
                if (winner.name === loser.name) continue;
                const expected = 1 - P(loser, winner);
                const delta = ALPHA * weight * expected;
                losersDelta[l] -= delta;
                winnersDelta[w] += delta;
                losersIndividual[l] += 1;
                winnersIndividual[w] += 1;
            }
        }

        // ties
        for (const [l, loser] of losers.entries()) {
            for (const [o, otherLoser] of losers.slice(l + 1).entries()) {
                if (otherLoser.name === loser.name) continue;
                const expected = 0.5 - P(loser, otherLoser);
                const delta = ALPHA * weight * expected;
                losersDelta[l] -= delta;
                losersDelta[o] += delta;
                losersIndividual[l] += 1;
                losersIndividual[l + 1 + o] += 1;
            }
        }

        return {
            losersDelta,
            winnersDelta,
            losersIndividual,
            winnersIndividual,
        };
    };

    const playGame = (orderOut, buyin, players) => {
        const playersInGame = orderOut.flatMap((name) => name.split("/"));
        Object.keys(players).forEach((name) => {
            players[name].wasInLastGame = false;
        });

        playersInGame.forEach((name) => {
            if (players[name]) {
                players[name].wasInLastGame = true;
                return;
            }
            players[name] = {
                name: capitalize(name),
                profit: 0,
                score: START_SCORE,
                games: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                lastPlaces: 0,
                bestHand: "",
                secondBestHand: "",
                thirdBestHand: "",
                wasInLastGame: true,
            };
        });

        playersInGame.forEach((name) => {
            players[name].previousProfit = players[name].profit;
            players[name].previousScore = players[name].score;

            players[name].previousStats = [
                players[name].games,
                players[name].wins,
                players[name].draws,
                players[name].lastPlaces,
            ];
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

        const lastPlaces = orderOut[0].split("/").map((name) => players[name]);

        lastPlaces.forEach((lastPlace) => {
            lastPlace.lastPlaces += 1 / lastPlaces.length;
        });

        const winners = orderOut[orderOut.length - 1]
            .split("/")
            .map((name) => players[name]);

        winners.forEach((winner) => {
            winner.losses--;
            if (winners.length >= 3)
                winner.losses += (winners.length - 2) / winners.length;
            winner.wins += 1 / winners.length;
            if (winners.length >= 2) winner.draws += 1 / winners.length;

            winner.profit +=
                (buyin * (playersInGame.length - 1)) / winners.length;
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

        const playerDeltaTracker = {};

        playersInGame.forEach((name) => {
            playerDeltaTracker[name] = { individualMatches: 0, delta: 0 };
        });

        for (const name of orderOut) {
            const names = name.split("/");
            names.forEach((name) => playerBuyins[name]--);

            const losers = names.map((name) => players[name]);
            const winners = Object.keys(playerBuyins)
                .filter((player) => playerBuyins[player] > 0)
                .map((playerName) => players[playerName]);

            const {
                losersDelta,
                winnersDelta,
                losersIndividual,
                winnersIndividual,
            } = makeAdjustments(losers, winners, buyin);

            losers.forEach((loser, i) => {
                playerDeltaTracker[loser.name.toLowerCase()].delta +=
                    losersDelta[i];
                playerDeltaTracker[
                    loser.name.toLowerCase()
                ].individualMatches += losersIndividual[i];
            });

            winners.forEach((winner, i) => {
                playerDeltaTracker[winner.name.toLowerCase()].delta +=
                    winnersDelta[i];
                playerDeltaTracker[
                    winner.name.toLowerCase()
                ].individualMatches += winnersIndividual[i];
            });
        }

        Object.keys(playerDeltaTracker).forEach((name) => {
            players[name].score +=
                playerDeltaTracker[name].delta /
                playerDeltaTracker[name].individualMatches;
        });
    };

    parseGames = (games) => {
        const players = {};
        for (const { players: orderOut, buyin } of games) {
            playGame(orderOut, buyin, players);
        }
        return players;
    };

    const capitalize = (string) =>
        string
            .split(" ")
            .map(
                (word) => word.substring(0, 1).toUpperCase() + word.substring(1)
            )
            .join(" ");
})();

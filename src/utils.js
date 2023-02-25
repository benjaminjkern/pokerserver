export const formatMoney = (value) => {
    if (value < 0) return `-${formatMoney(-value)}`;
    const [integer, decimal] = value.toFixed(2).split(".");
    return `$${commify(integer)}.${decimal}`;
};

export const commify = (integer) => {
    if (integer.length < 4) return integer;
    return `${commify(
        integer.substring(0, integer.length - 3)
    )},${integer.substring(integer.length - 3)}`;
};

export const capitalize = (string) =>
    string
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join(" ");

export const rankString = (rank) => {
    if (rank % 10 === 1 && parseInt(rank / 10) % 10 !== 1) return `${rank}st`;
    if (rank % 10 === 2 && parseInt(rank / 10) % 10 !== 1) return `${rank}nd`;
    if (rank % 10 === 3 && parseInt(rank / 10) % 10 !== 1) return `${rank}rd`;
    return `${rank}th`;
};

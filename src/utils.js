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

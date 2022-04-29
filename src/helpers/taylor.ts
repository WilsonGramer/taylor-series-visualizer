import { range, times } from "lodash";

const factorial = (n: number): number => (n < 2 ? 1 : factorial(n - 1) * n);

const { sin, cos, exp, log } = Math;
const negsin = (x: number) => -sin(x);
const negcos = (x: number) => -cos(x);
const nthderivlog = (n: number) => (x: number) => ((-1) ** (n - 1) * factorial(n - 1)) / x ** n;
const recip = (x: number) => 1 / x;
const nthderivrecip = (n: number) => (x: number) => ((-1) ** n * factorial(n)) / x ** (n + 1);

export const functions = {
    "sin(x)": [sin, cos, negsin, negcos, sin, cos, negsin, negcos, sin, cos, negsin],
    "cos(x)": [cos, negsin, negcos, sin, cos, negsin, negcos, sin, cos, negsin, negcos],
    "e^x": times(11, () => exp),
    "ln(x)": [log, ...range(1, 11).map(nthderivlog)],
    "1/x": [recip, ...range(1, 11).map(nthderivrecip)],
};

export const taylor = (fs: ((c: number) => number)[], c: number, o: number) => (x: number) =>
    fs.slice(0, o + 1).reduce((sum, f, n) => sum + (f(c) / factorial(n)) * (x - c) ** n, 0);

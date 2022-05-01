import { range, times } from "lodash";
import risingFactorial from "@stdlib/math-base-special-rising-factorial";

const factorial = (n: number): number => (n < 2 ? 1 : factorial(n - 1) * n);

const { sin, cos, exp, log, sqrt, cbrt, PI } = Math;
const negsin = (x: number) => -sin(x);
const negcos = (x: number) => -cos(x);
const nthderivlog = (n: number) => (x: number) => ((-1) ** (n - 1) * factorial(n - 1)) / x ** n;
const recip = (x: number) => 1 / x;
const nthderivrecip = (n: number) => (x: number) => ((-1) ** n * factorial(n)) / x ** (n + 1);
const sincb = (x: number) => sin(x) ** 3;
const nthderivsincb = (n: number) => (x: number) =>
    (1 / 4) * (3 * sin((n * PI) / 2 + x) - 3 ** n * sin((n * PI) / 2 + 3 * x));
const nthderivpolynomial = (k: number) => (n: number) => (x: number) =>
    x ** (k - n) * risingFactorial(1 + k - n, n);

export const functions = {
    "sin(x)": {
        functions: [sin, cos, negsin, negcos, sin, cos, negsin, negcos, sin, cos, negsin],
        requiresPositiveCenter: false,
    },
    "cos(x)": {
        functions: [cos, negsin, negcos, sin, cos, negsin, negcos, sin, cos, negsin, negcos],
        requiresPositiveCenter: false,
    },
    "e^x": {
        functions: times(11, () => exp),
        requiresPositiveCenter: false,
    },
    "ln(x)": {
        functions: [log, ...range(1, 11).map(nthderivlog)],
        requiresPositiveCenter: true,
    },
    "1/x": {
        functions: [recip, ...range(1, 11).map(nthderivrecip)],
        requiresPositiveCenter: false,
    },
    "sin^3(x)": {
        functions: [sincb, ...range(1, 11).map(nthderivsincb)],
        requiresPositiveCenter: false,
    },
    "sqrt(x)": {
        functions: [sqrt, ...range(1, 11).map(nthderivpolynomial(1 / 2))],
        requiresPositiveCenter: true,
    },
    "cbrt(x)": {
        functions: [cbrt, ...range(1, 11).map(nthderivpolynomial(1 / 3))],
        requiresPositiveCenter: true,
    },
};

export const taylor = (fs: ((c: number) => number)[], c: number, o: number) => (x: number) =>
    fs.slice(0, o + 1).reduce((sum, f, n) => sum + (f(c) / factorial(n)) * (x - c) ** n, 0);

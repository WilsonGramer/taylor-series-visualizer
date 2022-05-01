import { range } from "lodash";
import risingFactorial from "@stdlib/math-base-special-rising-factorial";
import factorial from "@stdlib/math-base-special-factorial";

const { sin, cos, exp, log, sqrt, cbrt, PI } = Math;

const ndpolynomial = (k: number) => (n: number) => (x: number) =>
    x ** (k - n) * risingFactorial(1 + k - n, n);

const getDerivatives = (n: number) => {
    const ns = range(1, n + 1);

    return (f: (x: number) => number, ndf: (n: number) => (x: number) => number) => [
        f,
        ...ns.map(ndf),
    ];
};

export const getFunctions = (n: number) => {
    const derivatives = getDerivatives(n);

    return {
        "sin(x)": {
            functions: derivatives(sin, (n) => (x) => sin((n * PI) / 2 + x)),
            requiresPositiveCenter: false,
        },
        "cos(x)": {
            functions: derivatives(cos, (n) => (x) => cos((n * PI) / 2 + x)),
            requiresPositiveCenter: false,
        },
        "e^x": {
            functions: derivatives(exp, () => exp),
            requiresPositiveCenter: false,
        },
        "ln(x)": {
            functions: derivatives(
                log,
                (n) => (x) => ((-1) ** (n - 1) * factorial(n - 1)) / x ** n
            ),
            requiresPositiveCenter: true,
        },
        "1/x": {
            functions: derivatives(
                (x) => 1 / x,
                (n) => (x) => ((-1) ** n * factorial(n)) / x ** (n + 1)
            ),
            requiresPositiveCenter: false,
        },
        "sin^3(x)": {
            functions: derivatives(
                (x) => sin(x) ** 3,
                (n) => (x) =>
                    (1 / 4) * (3 * sin((n * PI) / 2 + x) - 3 ** n * sin((n * PI) / 2 + 3 * x))
            ),
            requiresPositiveCenter: false,
        },
        "sqrt(x)": {
            functions: derivatives(sqrt, ndpolynomial(1 / 2)),
            requiresPositiveCenter: true,
        },
        "cbrt(x)": {
            functions: derivatives(cbrt, ndpolynomial(1 / 3)),
            requiresPositiveCenter: true,
        },
    };
};

export const taylor = (fs: ((c: number) => number)[], c: number, o: number) => (x: number) =>
    fs.slice(0, o + 1).reduce((sum, f, n) => sum + (f(c) / factorial(n)) * (x - c) ** n, 0);

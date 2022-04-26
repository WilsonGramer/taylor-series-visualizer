import { range, times } from "lodash";
import { MenuItem, Select, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

const factorial = (n: number): number => (n < 2 ? 1 : factorial(n - 1) * n);

const { sin, cos, exp, log } = Math;
const negsin = (x: number) => -sin(x);
const negcos = (x: number) => -cos(x);
const nthderivlog = (n: number) => (x: number) => ((-1) ** (n - 1) * factorial(n - 1)) / x ** n;

const functions = {
    "sin(x)": [sin, cos, negsin, negcos, sin, cos, negsin, negcos, sin, cos, negsin],
    "cos(x)": [cos, negsin, negcos, sin, cos, negsin, negcos, sin, cos, negsin],
    "e^x": times(10, () => exp),
    "ln(x)": [log, ...range(1, 11).map(nthderivlog)],
};

const taylor = (fs: ((c: number) => number)[], c: number, o: number) => (x: number) =>
    fs.slice(0, o + 1).reduce((sum, f, n) => sum + (f(c) / factorial(n)) * (x - c) ** n, 0);

const [min, max, step] = [-5, 5, 0.01];

const data = (func: keyof typeof functions, center: number, order: number) => {
    const f = functions[func][0];
    const g = taylor(functions[func], center, order);

    return range(min, max, step).map((x) => {
        console.log(x.toString());

        return {
            x: x.toFixed(2),
            Actual: f(x),
            Approximation: g(x),
        };
    });
};

export const App = () => {
    const [windowWidth, windowHeight] = useWindowSize();

    const [func, setFunc] = useState<keyof typeof functions>(Object.keys(functions)[0] as any);
    const [center, setCenter] = useState(0);
    const [order, setOrder] = useState(0);

    return (
        <div style={{ display: "flex" }}>
            <div style={{ width: 300, marginLeft: 20 }}>
                <h2>Taylor Series Visualizer</h2>
                <h3>By Wilson Gramer</h3>
                <hr />

                <p>Function</p>
                <Select value={func} onChange={(e) => setFunc(e.target.value as any)}>
                    {Object.keys(functions).map((func) => (
                        <MenuItem key={func} value={func}>
                            {func}
                        </MenuItem>
                    ))}
                </Select>

                <p>Center</p>
                <Slider
                    value={center}
                    min={min}
                    max={max}
                    step={0.1}
                    valueLabelDisplay="auto"
                    onChange={(_, value) => setCenter(value as any)}
                />

                <p>Order</p>
                <Slider
                    value={order}
                    min={0}
                    max={functions[func].length - 1}
                    marks
                    valueLabelDisplay="auto"
                    onChange={(_, value) => setOrder(value as any)}
                />
            </div>

            <LineChart
                width={windowWidth - 300}
                height={windowHeight}
                data={data(func, center, order)}
                margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
                <Tooltip formatter={(n: number) => n.toFixed(10)} />
                <Legend />
                <CartesianGrid />

                <XAxis dataKey="x" />
                <YAxis type="number" domain={[min, max]} allowDataOverflow={true} />

                <Line
                    type="monotone"
                    dataKey="Actual"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                />

                <Line
                    type="monotone"
                    dataKey="Approximation"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                />
            </LineChart>
        </div>
    );
};

const useWindowSize = () => {
    const [windowWidth, setWindowWidth] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);

    const updateWindowSize = () => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
    };

    useEffect(() => {
        updateWindowSize();
        window.addEventListener("resize", updateWindowSize);
    }, []);

    return [windowWidth, windowHeight];
};

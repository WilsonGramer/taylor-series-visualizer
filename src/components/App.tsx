import { last, range } from "lodash";
import { MenuItem, Select, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import * as math from "mathjs";

const functions = [
    "sin(x)",
    "cos(x)",
    "tan(x)",
    "csc(x)",
    "sec(x)",
    "e^x",
    "log(x)",
    "sqrt(x)",
].map((f) => math.parse(f));

const getDerivatives = (f: math.MathNode, count: number) => {
    const derivatives: math.MathNode[] = [f];
    for (let i = 0; i < count; i++) {
        derivatives.push(math.derivative(last(derivatives)!, "x"));
    }

    return derivatives.map((f) => {
        const compiled = f.compile();
        return (x: number) => compiled.evaluate({ x });
    });
};

const taylor = (f: math.MathNode, c: number, o: number) => {
    const derivatives = getDerivatives(f, o);

    return (x: number) =>
        derivatives.reduce((sum, f, n) => sum + (f(c) / math.factorial(n)) * (x - c) ** n, 0);
};

const [min, max, step] = [-5, 5, 0.01];

const data = (f: math.MathNode, center: number, order: number) => {
    const g = taylor(f, center, order);

    return range(min, max, step).map((x) => {
        const actual = f.evaluate({ x });
        const approximation = g(x);
        const error = Math.abs(actual - approximation);

        return {
            x: x.toFixed?.(2),
            actual,
            approximation,
            error,
        };
    });
};

export const App = () => {
    const [windowWidth, windowHeight] = useWindowSize();

    const [func, setFunc] = useState(functions[0]);
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
                    {functions.map((func, index) => (
                        <MenuItem key={index} value={func as any}>
                            {func.toString()}
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
                    onChange={(_, value) => setCenter(value as number)}
                />

                <p>Order</p>
                <Slider
                    value={order}
                    min={0}
                    max={10}
                    marks
                    valueLabelDisplay="auto"
                    onChange={(_, value) => setOrder(value as number)}
                />
            </div>

            <LineChart
                width={windowWidth - 300}
                height={windowHeight}
                data={data(func, center, order)}
                margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
                <Tooltip formatter={(n: number) => n.toFixed?.(10)} />
                <Legend />
                <CartesianGrid />

                <XAxis dataKey="x" />
                <YAxis type="number" domain={[min, max]} allowDataOverflow={true} />

                <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                />

                <Line
                    type="monotone"
                    dataKey="approximation"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                />

                <Line
                    type="monotone"
                    dataKey="error"
                    visibility="hidden"
                    activeDot={false}
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

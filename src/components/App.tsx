import { range } from "lodash";
import { MenuItem, Select, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { getFunctions, taylor } from "../helpers";

const [min, max, step] = [-5, 5, 0.01];

const maxOrder = 10;
const functions = getFunctions(maxOrder);

const data = (func: keyof typeof functions, center: number, order: number) => {
    const f = functions[func].functions[0];
    const g = taylor(functions[func].functions, center, order);

    return range(min, max, step).map((x) => {
        let actual: number | null = f(x);
        let approximation: number | null = g(x);

        actual = Math.abs(actual) < max ? actual : null;
        approximation = Math.abs(approximation) < max ? approximation : null;

        const error =
            actual != null && approximation != null ? Math.abs(actual - approximation) : null;

        return {
            x: x.toFixed(2),
            actual,
            approximation,
            error,
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

                <h3>
                    Made by <a href="https://gramer.dev">Wilson Gramer</a>
                </h3>

                <hr />

                <p>Function</p>

                <Select value={func} onChange={(e) => setFunc(e.target.value as any)}>
                    {Object.keys(functions).map((func) => (
                        <MenuItem key={func} value={func}>
                            {func}
                        </MenuItem>
                    ))}
                </Select>

                <p>
                    Center
                    <button onClick={() => setCenter(0)} disabled={center == 0}>
                        reset
                    </button>
                </p>

                <Slider
                    value={center}
                    min={functions[func].requiresPositiveCenter ? 0.01 : min}
                    max={max}
                    step={0.01}
                    valueLabelDisplay="auto"
                    onChange={(_, value) => setCenter(value as any)}
                />

                <p>
                    Order
                    <button onClick={() => setOrder(0)} disabled={order == 0}>
                        reset
                    </button>
                </p>

                <Slider
                    value={order}
                    min={0}
                    max={functions[func].functions.length - 1}
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
                    dataKey="actual"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                />

                <Line
                    type="monotone"
                    dataKey="approximation"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                />

                <Line
                    type="monotone"
                    dataKey="error"
                    stroke="#f87171"
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

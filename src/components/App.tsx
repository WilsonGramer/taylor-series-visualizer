import { range } from "lodash";
import { MenuItem, Select, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { functions, taylor } from "../helpers";

const [min, max, step] = [-5, 5, 0.01];

const data = (func: keyof typeof functions, center: number, order: number) => {
    const f = functions[func][0];
    const g = taylor(functions[func], center, order);

    return range(min, max, step).map((x) => {
        const actual = f(x);
        const approximation = g(x);

        return {
            x: x.toFixed(2),
            actual: Math.abs(actual) < max ? actual : null,
            approximation: Math.abs(approximation) < max ? approximation : null,
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
                    min={min}
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

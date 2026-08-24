import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrueWindSpeedInput = {
  readonly apparentWindSpeedKt: number;
  readonly apparentWindAngleDeg: number;
  readonly boatSpeedKt: number;
};

export type TrueWindSpeedOutput = {
  readonly trueWindSpeedKt: number;
};

export const trueWindSpeedExample = {
  input: {
    apparentWindSpeedKt: 20,
    apparentWindAngleDeg: 90,
    boatSpeedKt: 5,
  },
  output: { trueWindSpeedKt: 20.615528128088304 },
} satisfies ToolExample<TrueWindSpeedInput, TrueWindSpeedOutput>;

export const trueWindSpeedTool = createSimpleTool({
  id: "nautical/true-wind-speed",
  title: "True Wind Speed Calculator",
  description:
    "Calculate the true wind speed in knots from apparent wind speed, apparent wind angle, and boat speed.",
  inputs: [
    {
      id: "apparentWindSpeedKt",
      kind: "number",
      label: "Apparent wind speed",
    },
    {
      id: "apparentWindAngleDeg",
      kind: "number",
      label: "Apparent wind angle",
      maximum: 360,
      minimum: 0,
    },
    {
      id: "boatSpeedKt",
      kind: "number",
      label: "Boat speed",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "trueWindSpeedKt", kind: "number", label: "True wind speed" },
  ],
  calculate: (input) => {
    const aws = input.apparentWindSpeedKt as number;
    if (aws < 0)
      simpleError(
        "apparentWindSpeedKt",
        "Apparent wind speed cannot be negative.",
        "invalid_input",
      );
    const awaRad = (input.apparentWindAngleDeg as number) * (Math.PI / 180);
    const boatSpeedKt = input.boatSpeedKt as number;
    const squared =
      aws * aws +
      boatSpeedKt * boatSpeedKt -
      2 * aws * boatSpeedKt * Math.cos(awaRad);
    return { trueWindSpeedKt: Math.sqrt(Math.max(0, squared)) };
  },
});
export const runTrueWindSpeed = trueWindSpeedTool.execute;
export default trueWindSpeedTool;

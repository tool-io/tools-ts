import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GroundspeedWindCorrectedInput = {
  readonly crosswindKt: number;
  readonly headwindKt: number;
  readonly trueAirspeedKt: number;
};

export type GroundspeedWindCorrectedOutput = {
  readonly groundSpeedKt: number;
};

export const groundspeedWindCorrectedExample = {
  input: { crosswindKt: 0, headwindKt: 20, trueAirspeedKt: 100 },
} satisfies ToolExample<GroundspeedWindCorrectedInput>;

export const groundspeedWindCorrectedTool = createSimpleTool({
  id: "aviation/groundspeed-wind-corrected",
  title: "Groundspeed Corrected Calculator",
  description:
    "Compute ground speed from true airspeed with signed headwind and crosswind components.",
  inputs: [
    {
      description: "Signed crosswind component.",
      id: "crosswindKt",
      label: "Crosswind component",
      kind: "number",
      unit: "kt",
    },
    {
      description: "Signed headwind component; negative means tailwind.",
      id: "headwindKt",
      label: "Headwind component",
      kind: "number",
      unit: "kt",
    },
    {
      id: "trueAirspeedKt",
      label: "True airspeed",
      kind: "number",
      unit: "kt",
    },
  ],
  outputs: [
    { id: "groundSpeedKt", label: "Ground speed", kind: "number", unit: "kt" },
  ],
  calculate: (input) => {
    const crosswindKt = input.crosswindKt as number;
    const headwindKt = input.headwindKt as number;
    const trueAirspeedKt = input.trueAirspeedKt as number;
    if (trueAirspeedKt <= 0)
      simpleError(
        "trueAirspeedKt",
        "The true airspeed must be greater than zero.",
      );
    if (trueAirspeedKt < Math.abs(crosswindKt))
      simpleError(
        "trueAirspeedKt",
        "The true airspeed cannot overcome the wind components.",
        "insufficient_airspeed",
      );
    const groundSpeedKt =
      Math.sqrt(
        Math.max(
          0,
          trueAirspeedKt * trueAirspeedKt - crosswindKt * crosswindKt,
        ),
      ) - headwindKt;
    if (groundSpeedKt < 0)
      simpleError(
        "trueAirspeedKt",
        "The true airspeed cannot produce forward groundspeed against these wind components.",
        "insufficient_airspeed",
      );
    return { groundSpeedKt };
  },
});
export const runGroundspeedWindCorrected = groundspeedWindCorrectedTool.execute;
export default groundspeedWindCorrectedTool;

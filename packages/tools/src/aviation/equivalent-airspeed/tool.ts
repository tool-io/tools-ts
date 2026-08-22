import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";
import { calculateDensityRatio } from "../density-ratio/tool.js";

export type EquivalentAirspeedInput = {
  readonly altitudeFt: number;
  readonly tasKt: number;
};

export type EquivalentAirspeedOutput = {
  readonly easKt: number;
};

export const equivalentAirspeedExample = {
  input: { altitudeFt: 5000, tasKt: 200 },
  output: { easKt: 185.65169729 },
} satisfies ToolExample<EquivalentAirspeedInput, EquivalentAirspeedOutput>;

export const calculateEquivalentAirspeed = (
  input: EquivalentAirspeedInput,
): EquivalentAirspeedOutput => {
  const densityRatio = calculateDensityRatio({
    altitudeFt: input.altitudeFt,
  }).densityRatio;
  return {
    easKt: roundStatistic(input.tasKt * Math.sqrt(densityRatio)),
  };
};

export const equivalentAirspeedTool = createSimpleTool({
  calculate: (input) =>
    calculateEquivalentAirspeed(input as unknown as EquivalentAirspeedInput),
  description:
    "Convert true airspeed to equivalent airspeed for the altitude's density ratio.",
  id: "aviation/equivalent-airspeed",
  inputs: [
    {
      description: "True airspeed.",
      id: "tasKt",
      kind: "number",
      label: "TAS",
      unit: "kt",
    },
    {
      description:
        "Pressure altitude of the observation in the standard atmosphere.",
      id: "altitudeFt",
      kind: "number",
      label: "Pressure altitude",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "Equivalent airspeed at sea level density.",
      format: "speed",
      id: "easKt",
      kind: "number",
      label: "EAS",
      unit: "kt",
    },
  ],
  title: "Equivalent Airspeed Calculator",
});
export const runEquivalentAirspeed = equivalentAirspeedTool.execute;
export default equivalentAirspeedTool;

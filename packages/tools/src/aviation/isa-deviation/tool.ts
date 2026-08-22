import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";
import { calculateStandardTemperature } from "../standard-temperature/tool.js";

export type IsaDeviationInput = {
  readonly altitudeFt: number;
  readonly oatC: number;
};

export type IsaDeviationOutput = {
  readonly deviationC: number;
};

export const isaDeviationExample = {
  input: { altitudeFt: 5000, oatC: 10 },
  output: { deviationC: 4.906 },
} satisfies ToolExample<IsaDeviationInput, IsaDeviationOutput>;

export const calculateIsaDeviation = (
  input: IsaDeviationInput,
): IsaDeviationOutput => {
  const standard = calculateStandardTemperature({
    altitudeFt: input.altitudeFt,
  }).standardTemperatureC;
  return { deviationC: roundStatistic(input.oatC - standard) };
};

export const isaDeviationTool = createSimpleTool({
  calculate: (input) =>
    calculateIsaDeviation(input as unknown as IsaDeviationInput),
  description:
    "Compute how much the outside air temperature deviates from ISA at the altitude.",
  id: "aviation/isa-deviation",
  inputs: [
    {
      description:
        "Pressure altitude of the observation in the standard atmosphere.",
      id: "altitudeFt",
      kind: "number",
      label: "Pressure altitude",
      unit: "ft",
    },
    {
      description: "Observed outside air temperature.",
      id: "oatC",
      kind: "number",
      label: "OAT",
      unit: "°C",
    },
  ],
  outputs: [
    {
      description:
        "OAT minus ISA standard temperature; positive means warmer than standard.",
      format: "temperature-c",
      id: "deviationC",
      kind: "number",
      label: "ISA deviation",
      unit: "°C",
    },
  ],
  title: "ISA Deviation Calculator",
});
export const runIsaDeviation = isaDeviationTool.execute;
export default isaDeviationTool;

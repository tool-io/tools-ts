import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const KM_PER_NM = 1.852;

export type NauticalMileToKmInput = {
  readonly nauticalMiles: number;
};

export type NauticalMileToKmOutput = {
  readonly kilometers: number;
};

export const nauticalMileToKmExample = {
  input: { nauticalMiles: 10 },
  output: { kilometers: 18.52 },
} satisfies ToolExample<NauticalMileToKmInput, NauticalMileToKmOutput>;

export const nauticalMileToKmTool = createSimpleTool({
  id: "nautical/nautical-mile-to-km",
  title: "Nautical Mile to Kilometers Converter",
  description:
    "Convert a distance in nautical miles to kilometers using the exact factor of one point eight five two.",
  inputs: [
    {
      id: "nauticalMiles",
      kind: "number",
      label: "Nautical miles",
      minimum: 0,
    },
  ],
  outputs: [{ id: "kilometers", kind: "number", label: "Kilometers" }],
  calculate: (input) => ({
    kilometers: (input.nauticalMiles as number) * KM_PER_NM,
  }),
});
export const runNauticalMileToKm = nauticalMileToKmTool.execute;
export default nauticalMileToKmTool;

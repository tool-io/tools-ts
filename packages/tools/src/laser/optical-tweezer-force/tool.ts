import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly opticalPowerWatts: number;
  readonly mediumRefractiveIndex: number;
  readonly trappingEfficiency: number;
}>;
export type Output = Readonly<{
  readonly gradientForceNewtons: number;
  readonly gradientForcePiconewtons: number;
}>;

export const calculate = (input: Input): Output => {
  const gradientForceNewtons =
    (input.mediumRefractiveIndex *
      input.opticalPowerWatts *
      input.trappingEfficiency) /
    299792458;
  return {
    gradientForceNewtons,
    gradientForcePiconewtons: gradientForceNewtons * 1e12,
  };
};

export const exampleInput = {
  opticalPowerWatts: 299792458,
  mediumRefractiveIndex: 1,
  trappingEfficiency: 1,
} satisfies Input;
export const exampleOutput = {
  gradientForceNewtons: 1,
  gradientForcePiconewtons: 1000000000000.0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      opticalPowerWatts: input.opticalPowerWatts as number,
      mediumRefractiveIndex: input.mediumRefractiveIndex as number,
      trappingEfficiency: input.trappingEfficiency as number,
    }),
  description:
    "Estimate optical-tweezer gradient force using a caller-supplied trapping efficiency.",
  id: "laser/optical-tweezer-force",
  inputs: [
    {
      id: "opticalPowerWatts",
      label: "Trapping-beam power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "mediumRefractiveIndex",
      label: "Medium refractive index",
      kind: "number",
      minimum: 0,
    },
    {
      id: "trappingEfficiency",
      label: "Dimensionless trapping efficiency",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "gradientForceNewtons",
      label: "Estimated gradient force",
      kind: "number",
      minimum: 0,
      unit: "N",
    },
    {
      id: "gradientForcePiconewtons",
      label: "Estimated gradient force",
      kind: "number",
      minimum: 0,
      unit: "pN",
    },
  ],
  title: "Optical-Tweezer Force",
});

export const run = tool.execute;
export default tool;

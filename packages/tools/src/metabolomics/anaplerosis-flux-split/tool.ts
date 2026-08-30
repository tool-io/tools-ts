import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly pyruvateCarboxylaseFlux: number;
  readonly pepckFlux: number;
}>;
export type Output = Readonly<{
  readonly totalFlux: number;
  readonly carboxylaseSharePercent: number;
  readonly pepckSharePercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (Math.min(input.pyruvateCarboxylaseFlux, input.pepckFlux) < 0)
    simpleError("pyruvateCarboxylaseFlux", "Fluxes must be nonnegative.");
  const totalFlux = input.pyruvateCarboxylaseFlux + input.pepckFlux;
  if (totalFlux <= 0)
    simpleError("pyruvateCarboxylaseFlux", "Total flux must be positive.");
  return {
    totalFlux,
    carboxylaseSharePercent: (input.pyruvateCarboxylaseFlux / totalFlux) * 100,
    pepckSharePercent: (input.pepckFlux / totalFlux) * 100,
  };
};
export const exampleInput = {
  pyruvateCarboxylaseFlux: 30,
  pepckFlux: 70,
} satisfies Input;
export const exampleOutput = {
  totalFlux: 100,
  carboxylaseSharePercent: 30,
  pepckSharePercent: 70,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/anaplerosis-flux-split",
  title: "Anaplerosis Flux Split",
  description:
    "Partition two measured anaplerosis-associated fluxes by caller-defined branches.",
  inputs: [
    {
      id: "pyruvateCarboxylaseFlux",
      kind: "number",
      label: "Pyruvate carboxylase flux",
    },
    { id: "pepckFlux", kind: "number", label: "Pepck flux" },
  ],
  outputs: [
    { id: "totalFlux", kind: "number", label: "Total flux" },
    {
      id: "carboxylaseSharePercent",
      kind: "number",
      label: "Carboxylase share percent",
    },
    { id: "pepckSharePercent", kind: "number", label: "Pepck share percent" },
  ],
  calculate: (value) =>
    calculate({
      pyruvateCarboxylaseFlux: value.pyruvateCarboxylaseFlux as number,
      pepckFlux: value.pepckFlux as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly widefieldResolutionNanometers: number;
  readonly simImprovementFactor: number;
}>;
export type Output = Readonly<{
  readonly simResolutionNanometers: number;
  readonly resolutionImprovementPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.simImprovementFactor <= 0)
    simpleError(
      "simImprovementFactor",
      "Improvement factor must be positive.",
      "invalid_factor",
    );
  const simResolutionNanometers =
    input.widefieldResolutionNanometers / input.simImprovementFactor;
  return {
    simResolutionNanometers,
    resolutionImprovementPercent: (1 - 1 / input.simImprovementFactor) * 100,
  };
};

export const exampleInput = {
  widefieldResolutionNanometers: 250,
  simImprovementFactor: 2,
} satisfies Input;
export const exampleOutput = {
  simResolutionNanometers: 125,
  resolutionImprovementPercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      widefieldResolutionNanometers:
        input.widefieldResolutionNanometers as number,
      simImprovementFactor: input.simImprovementFactor as number,
    }),
  description:
    "Estimate structured-illumination resolution from a measured widefield baseline and improvement factor.",
  id: "laser/sim-resolution-improvement",
  inputs: [
    {
      id: "widefieldResolutionNanometers",
      label: "Widefield resolution",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "simImprovementFactor",
      label: "SIM improvement factor",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "simResolutionNanometers",
      label: "Estimated SIM resolution",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "resolutionImprovementPercent",
      label: "Resolution improvement",
      kind: "number",
      unit: "%",
    },
  ],
  title: "SIM Resolution Improvement",
});

export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly betaHydroxybutyrate: number;
  readonly acetoacetate: number;
  readonly minimumRedoxRatio: number;
}>;
export type Output = Readonly<{
  readonly redoxRatio: number;
  readonly elevated: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.betaHydroxybutyrate < 0 || input.acetoacetate <= 0)
    simpleError("acetoacetate", "Acetoacetate must be positive.");
  const redoxRatio = input.betaHydroxybutyrate / input.acetoacetate;
  return { redoxRatio, elevated: redoxRatio >= input.minimumRedoxRatio };
};
export const exampleInput = {
  betaHydroxybutyrate: 10,
  acetoacetate: 2,
  minimumRedoxRatio: 3,
} satisfies Input;
export const exampleOutput = { redoxRatio: 5, elevated: true } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/ketone-redox-ratio",
  title: "Ketone Redox Ratio",
  description: "Compute the β-hydroxybutyrate/acetoacetate redox proxy.",
  inputs: [
    {
      id: "betaHydroxybutyrate",
      kind: "number",
      label: "Beta hydroxybutyrate",
    },
    { id: "acetoacetate", kind: "number", label: "Acetoacetate" },
    { id: "minimumRedoxRatio", kind: "number", label: "Minimum redox ratio" },
  ],
  outputs: [
    { id: "redoxRatio", kind: "number", label: "Redox ratio" },
    { id: "elevated", kind: "boolean", label: "Elevated" },
  ],
  calculate: (value) =>
    calculate({
      betaHydroxybutyrate: value.betaHydroxybutyrate as number,
      acetoacetate: value.acetoacetate as number,
      minimumRedoxRatio: value.minimumRedoxRatio as number,
    }),
});
export const run = tool.execute;
export default tool;

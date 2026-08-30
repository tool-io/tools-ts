import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly stoichiometry: readonly (readonly number[])[];
  readonly fluxes: readonly number[];
  readonly residualTolerance: number;
}>;
export type Output = Readonly<{
  readonly reactionCount: number;
  readonly metaboliteCount: number;
  readonly residuals: readonly number[];
  readonly balanced: boolean;
}>;
export const calculate = (input: Input): Output => {
  const m = input.stoichiometry,
    n = input.fluxes.length;
  if (
    m.length === 0 ||
    n === 0 ||
    m.some((r) => r.length !== n) ||
    input.residualTolerance < 0
  )
    simpleError(
      "stoichiometry",
      "Rectangular stoichiometry and aligned flux vector required.",
    );
  const residuals = m.map((r) =>
    r.reduce((s, v, i) => s + v * input.fluxes[i], 0),
  );
  return {
    reactionCount: n,
    metaboliteCount: m.length,
    residuals,
    balanced: residuals.every((v) => Math.abs(v) <= input.residualTolerance),
  };
};
export const exampleInput = {
  stoichiometry: [
    [1, -1],
    [2, -2],
  ],
  fluxes: [1, 1],
  residualTolerance: 0,
} satisfies Input;
export const exampleOutput = {
  reactionCount: 2,
  metaboliteCount: 2,
  residuals: [0, 0],
  balanced: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/stoichiometric-flux-balance",
  title: "Stoichiometric Flux Balance",
  description:
    "Check S·v steady-state residuals against a supplied flux-balance tolerance.",
  inputs: [
    { id: "stoichiometry", kind: "matrix", label: "Stoichiometry" },
    { id: "fluxes", kind: "numberList", label: "Fluxes" },
    { id: "residualTolerance", kind: "number", label: "Residual tolerance" },
  ],
  outputs: [
    { id: "reactionCount", kind: "number", label: "Reaction count" },
    { id: "metaboliteCount", kind: "number", label: "Metabolite count" },
    { id: "residuals", kind: "numberList", label: "Residuals" },
    { id: "balanced", kind: "boolean", label: "Balanced" },
  ],
  calculate: (value) =>
    calculate({
      stoichiometry: value.stoichiometry as readonly (readonly number[])[],
      fluxes: value.fluxes as readonly number[],
      residualTolerance: value.residualTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;

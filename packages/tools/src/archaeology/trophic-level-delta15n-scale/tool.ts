import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly sampleDelta15N: number;
  readonly baselineDelta15N: number;
  readonly baselineTrophicLevel: number;
  readonly enrichmentPerTrophicLevel: number;
  readonly sampleSigmaPerMil: number;
  readonly baselineSigmaPerMil: number;
}>;
export type Output = Readonly<{
  readonly modelTrophicLevel: number;
  readonly independentLevelSigma: number;
}>;
const inputFields = [
  { id: "sampleDelta15N", label: "Sample delta15 n", kind: "number" },
  { id: "baselineDelta15N", label: "Baseline delta15 n", kind: "number" },
  {
    id: "baselineTrophicLevel",
    label: "Baseline trophic level",
    kind: "number",
  },
  {
    id: "enrichmentPerTrophicLevel",
    label: "Enrichment per trophic level",
    kind: "number",
  },
  { id: "sampleSigmaPerMil", label: "Sample sigma per mil", kind: "number" },
  {
    id: "baselineSigmaPerMil",
    label: "Baseline sigma per mil",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.enrichmentPerTrophicLevel, "enrichmentPerTrophicLevel");
  positive(input.baselineTrophicLevel, "baselineTrophicLevel");
  nonnegative(input.sampleSigmaPerMil, "sampleSigmaPerMil");
  nonnegative(input.baselineSigmaPerMil, "baselineSigmaPerMil");
  return {
    modelTrophicLevel:
      input.baselineTrophicLevel +
      (input.sampleDelta15N - input.baselineDelta15N) /
        input.enrichmentPerTrophicLevel,
    independentLevelSigma:
      Math.hypot(input.sampleSigmaPerMil, input.baselineSigmaPerMil) /
      input.enrichmentPerTrophicLevel,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleDelta15N: 10,
  baselineDelta15N: 4,
  baselineTrophicLevel: 1,
  enrichmentPerTrophicLevel: 3,
  sampleSigmaPerMil: 0.3,
  baselineSigmaPerMil: 0.4,
} satisfies Input;
export const exampleOutput = {
  modelTrophicLevel: 3,
  independentLevelSigma: 0.16666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/trophic-level-delta15n-scale",
  title: "Delta15N Trophic Level Scale",
  description:
    "Evaluate caller nitrogen-enrichment trophic proxy with independent measurement/baseline uncertainty; signed relative positions remain and baseline/enrichment differences are not dietary diagnosis.",
  inputs: inputFields,
  outputs: [
    { id: "modelTrophicLevel", label: "Model trophic level", kind: "number" },
    {
      id: "independentLevelSigma",
      label: "Independent level sigma",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleDelta15N: value.sampleDelta15N as number,
      baselineDelta15N: value.baselineDelta15N as number,
      baselineTrophicLevel: value.baselineTrophicLevel as number,
      enrichmentPerTrophicLevel: value.enrichmentPerTrophicLevel as number,
      sampleSigmaPerMil: value.sampleSigmaPerMil as number,
      baselineSigmaPerMil: value.baselineSigmaPerMil as number,
    }),
});
export const run = tool.execute;
export default tool;

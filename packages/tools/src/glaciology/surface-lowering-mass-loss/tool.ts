import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly surfaceLoweringM: number;
  readonly nonMassRelatedCompactionM: number;
  readonly observedAreaM2: number;
  readonly lossDensityKgM3: number;
}>;
export type Output = Readonly<{
  readonly compactionCorrectedLoweringM: number;
  readonly signedMassLossKg: number;
}>;
const inputFields = [
  { id: "surfaceLoweringM", label: "Surface lowering m", kind: "number" },
  {
    id: "nonMassRelatedCompactionM",
    label: "Non mass related compaction m",
    kind: "number",
  },
  { id: "observedAreaM2", label: "Observed area m2", kind: "number" },
  { id: "lossDensityKgM3", label: "Loss density kg m3", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.lossDensityKgM3, "lossDensityKgM3");
  nonnegative(input.observedAreaM2, "observedAreaM2");
  const h = input.surfaceLoweringM - input.nonMassRelatedCompactionM;
  return {
    compactionCorrectedLoweringM: h,
    signedMassLossKg: h * input.observedAreaM2 * input.lossDensityKgM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  surfaceLoweringM: 2,
  nonMassRelatedCompactionM: 0.5,
  observedAreaM2: 100,
  lossDensityKgM3: 900,
} satisfies Input;
export const exampleOutput = {
  compactionCorrectedLoweringM: 1.5,
  signedMassLossKg: 135000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/surface-lowering-mass-loss",
  title: "Surface Lowering Mass Loss Calculator",
  description:
    "Convert observed lowering after explicit non-mass compaction correction to signed mass loss; no geodesy transform, firn-density inference or automatic claim every height change is mass loss.",
  inputs: inputFields,
  outputs: [
    {
      id: "compactionCorrectedLoweringM",
      label: "Compaction corrected lowering m",
      kind: "number",
    },
    { id: "signedMassLossKg", label: "Signed mass loss kg", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      surfaceLoweringM: value.surfaceLoweringM as number,
      nonMassRelatedCompactionM: value.nonMassRelatedCompactionM as number,
      observedAreaM2: value.observedAreaM2 as number,
      lossDensityKgM3: value.lossDensityKgM3 as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedNitrogenMol: readonly number[];
  readonly observedPhosphorusMol: readonly number[];
  readonly callerReferenceNpMolarRatio: number;
}>;
export type Output = Readonly<{
  readonly pooledNpMolarRatio: number;
  readonly signedNpReferenceDifference: number;
}>;
const inputFields = [
  {
    id: "observedNitrogenMol",
    label: "Observed nitrogen mol",
    kind: "numberList",
  },
  {
    id: "observedPhosphorusMol",
    label: "Observed phosphorus mol",
    kind: "numberList",
  },
  {
    id: "callerReferenceNpMolarRatio",
    label: "Caller reference np molar ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPhosphorusMol.forEach((v) =>
    positive(v, "observedPhosphorusMol"),
  );
  positive(input.callerReferenceNpMolarRatio, "callerReferenceNpMolarRatio");
  input.observedNitrogenMol.forEach((v) =>
    nonnegative(v, "observedNitrogenMol"),
  );
  aligned(
    input.observedNitrogenMol,
    input.observedPhosphorusMol,
    "observedNitrogenMol",
  );
  const r = sum(input.observedNitrogenMol) / sum(input.observedPhosphorusMol);
  return {
    pooledNpMolarRatio: r,
    signedNpReferenceDifference: r - input.callerReferenceNpMolarRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedNitrogenMol: [10, 20],
  observedPhosphorusMol: [1, 1],
  callerReferenceNpMolarRatio: 16,
} satisfies Input;
export const exampleOutput = {
  pooledNpMolarRatio: 15,
  signedNpReferenceDifference: -1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/redfield-ratio-np-checker",
  title: "Redfield Ratio NP Checker",
  description:
    "Actual pooled N/P MOLAR inventory versus explicit reference, not mass ratio, species constants or nutrient limitation diagnosis. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledNpMolarRatio",
      label: "Pooled np molar ratio",
      kind: "number",
    },
    {
      id: "signedNpReferenceDifference",
      label: "Signed np reference difference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedNitrogenMol: value.observedNitrogenMol as readonly number[],
      observedPhosphorusMol: value.observedPhosphorusMol as readonly number[],
      callerReferenceNpMolarRatio: value.callerReferenceNpMolarRatio as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedSeatHeightCm: number;
  readonly observedShodPoplitealHeightCm: number;
  readonly callerAllowedMismatchCm: number;
}>;
export type Output = Readonly<{
  readonly signedSeatLegMismatchCm: number;
  readonly callerFootrestReview: boolean;
}>;
const inputFields = [
  {
    id: "observedSeatHeightCm",
    label: "Observed seat height cm",
    kind: "number",
  },
  {
    id: "observedShodPoplitealHeightCm",
    label: "Observed shod popliteal height cm",
    kind: "number",
  },
  {
    id: "callerAllowedMismatchCm",
    label: "Caller allowed mismatch cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedSeatHeightCm, "observedSeatHeightCm");
  positive(
    input.observedShodPoplitealHeightCm,
    "observedShodPoplitealHeightCm",
  );
  nonnegative(input.callerAllowedMismatchCm, "callerAllowedMismatchCm");
  const d = input.observedSeatHeightCm - input.observedShodPoplitealHeightCm;
  return {
    signedSeatLegMismatchCm: d,
    callerFootrestReview: d > input.callerAllowedMismatchCm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSeatHeightCm: 50,
  observedShodPoplitealHeightCm: 45,
  callerAllowedMismatchCm: 2,
} satisfies Input;
export const exampleOutput = {
  signedSeatLegMismatchCm: 5,
  callerFootrestReview: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/footrest-necessity-flag",
  title: "Footrest Necessity Flag by Leg Length Mismatch Checker",
  description:
    "Measured seat/shod leg-height mismatch screen, not automatic footrest necessity independent of task. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedSeatLegMismatchCm",
      label: "Signed seat leg mismatch cm",
      kind: "number",
    },
    {
      id: "callerFootrestReview",
      label: "Caller footrest review",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSeatHeightCm: value.observedSeatHeightCm as number,
      observedShodPoplitealHeightCm:
        value.observedShodPoplitealHeightCm as number,
      callerAllowedMismatchCm: value.callerAllowedMismatchCm as number,
    }),
});
export const run = tool.execute;
export default tool;

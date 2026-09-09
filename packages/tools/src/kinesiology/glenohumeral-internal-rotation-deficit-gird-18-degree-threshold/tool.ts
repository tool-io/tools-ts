import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly observedDominantInternalRotationDegrees: number;
  readonly observedNondominantInternalRotationDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedDominantInternalRotationDegrees",
    label: "Observed dominant internal rotation degrees",
    kind: "number",
  },
  {
    id: "observedNondominantInternalRotationDegrees",
    label: "Observed nondominant internal rotation degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.observedDominantInternalRotationDegrees,
    input.observedNondominantInternalRotationDegrees,
  ].forEach((v) => nonnegative(v, "angle"));
  const d =
    input.observedNondominantInternalRotationDegrees -
    input.observedDominantInternalRotationDegrees;
  return {
    signedInternalRotationDeficitDegrees: d,
    atOrAboveNominalEighteenDegrees: d >= 18,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedDominantInternalRotationDegrees: 40,
    observedNondominantInternalRotationDegrees: 60,
  },
  output: {
    result: {
      signedInternalRotationDeficitDegrees: 20,
      atOrAboveNominalEighteenDegrees: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/glenohumeral-internal-rotation-deficit-gird-18-degree-threshold",
  title: "Glenohumeral Internal Rotation Deficit GIRD18\u00b0 Threshold",
  description:
    "Matched independently measured IRloss, nondominant minus dominant, screened against explicitly nominal18 degrees. Total arc, bony adaptation, protocol, history and uncertainty remain essential; no GIRDdiagnosis or treatment.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

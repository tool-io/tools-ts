import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyAssignedCueFrameIndex: number;
  readonly callerVerifiedFramePitchMillimeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyAssignedCueFrameIndex",
    label: "Actual independently assigned cue frame index",
    kind: "number",
  },
  {
    id: "callerVerifiedFramePitchMillimeters",
    label: "Caller verified frame pitch millimeters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualIndependentlyAssignedCueFrameIndex,
    "actualIndependentlyAssignedCueFrameIndex",
    0,
    1000000,
  );
  positive(
    input.callerVerifiedFramePitchMillimeters,
    "callerVerifiedFramePitchMillimeters",
  );
  return {
    value:
      input.actualIndependentlyAssignedCueFrameIndex *
      input.callerVerifiedFramePitchMillimeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyAssignedCueFrameIndex: 10,
    callerVerifiedFramePitchMillimeters: 2,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "film/cue-mark-position",
  title: "Cue Mark Position Calculator",
  description:
    "Actual already assigned cue frame index\u00d7independently gauge/per for at ion-qualified physical frame pitch filmpositionmm, not choose cue lead time or a universal35mmframepitch.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

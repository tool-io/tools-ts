import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredProbingDepthMm: number;
  readonly independentlyMeasuredSignedGingivalMarginApicalToCejMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredProbingDepthMm",
    label: "Independently measured probing depth mm",
    kind: "number",
  },
  {
    id: "independentlyMeasuredSignedGingivalMarginApicalToCejMm",
    label: "Independently measured signed gingival margin apical to cej mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredProbingDepthMm, "depth");
  return {
    signedClinicalAttachmentLevelMm:
      input.independentlyMeasuredProbingDepthMm +
      input.independentlyMeasuredSignedGingivalMarginApicalToCejMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredProbingDepthMm: 4,
    independentlyMeasuredSignedGingivalMarginApicalToCejMm: 2,
  },
  output: { result: { signedClinicalAttachmentLevelMm: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/clinical-attachment-loss",
  title: "Clinical Attachment Loss Calculator",
  description:
    "Actual CALcoordinate=probingdepth+signed gingival margin displacement apical to CEJ; coronal margin NEGATIVE. Matching anatomical site/calibrations required. Negative coordinate retained as inconsistency/coronal attachment for review, not diagnosis.",
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

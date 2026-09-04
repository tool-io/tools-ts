import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch44-shared.js";

export type Input = Readonly<{
  readonly independentlyAnnotatedStopAffricateCount: number;
  readonly totalIndependentlyTranscribedSegments: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedStopAffricateCount",
    label: "Independently annotated stop affricate count",
    kind: "number",
  },
  {
    id: "totalIndependentlyTranscribedSegments",
    label: "Total independently transcribed segments",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.totalIndependentlyTranscribedSegments, "segments", 1, 1000000);
  bounded(
    input.independentlyAnnotatedStopAffricateCount,
    "count",
    0,
    input.totalIndependentlyTranscribedSegments,
  );
  return {
    percussiveSegmentFraction:
      input.independentlyAnnotatedStopAffricateCount /
      input.totalIndependentlyTranscribedSegments,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAnnotatedStopAffricateCount: 6,
    totalIndependentlyTranscribedSegments: 20,
  },
  output: { result: { percussiveSegmentFraction: 0.3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/tongue-twister-percussive-density-estimate",
  title: "Tongue Twister Percussive Density Estimate",
  description:
    "Density of independently transcribed stop/affricate segments in a tongue twister. Same transcription basis required; not spelling-based phonology, speech difficulty or safe speech therapy.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

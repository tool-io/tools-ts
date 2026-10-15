import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyIdentifiedPolarityReversalCount: number;
  readonly actualCompleteRecordedIntervalMillionsOfYears: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualIndependentlyIdentifiedPolarityReversalCount",
    label: "Actual independently identified polarity reversal count",
    kind: "number",
  },
  {
    id: "actualCompleteRecordedIntervalMillionsOfYears",
    label: "Actual complete recorded interval millions of years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualIndependentlyIdentifiedPolarityReversalCount,
    "numerator",
  );
  positive(input.actualCompleteRecordedIntervalMillionsOfYears, "denominator");
  return {
    observedRatio:
      (1 * input.actualIndependentlyIdentifiedPolarityReversalCount) /
      input.actualCompleteRecordedIntervalMillionsOfYears,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyIdentifiedPolarityReversalCount: 2,
    actualCompleteRecordedIntervalMillionsOfYears: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/magnetostratigraphy-reversal-frequency",
  title: "Geology Magnetostratigraphy Reversal Frequency Calculator",
  description:
    "Actual magnetostratigraphic identified reversals per complete recorded Ma, not polarity chrons boundary ambiguity, true unsampled reversal frequency or geomagnetic forecast. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { observedRatio: { type: "number" } },
        required: ["observedRatio"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

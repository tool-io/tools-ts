import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredFiveMandibularContactDisplacementsMm: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "independentlyMeasuredFiveMandibularContactDisplacementsMm",
    label: "Independently measured five mandibular contact displacements mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  if (
    input.independentlyMeasuredFiveMandibularContactDisplacementsMm.length !== 5
  )
    simpleError(
      "contacts",
      "Exactly five independently assessed anterior contact displacements.",
    );
  input.independentlyMeasuredFiveMandibularContactDisplacementsMm.forEach((v) =>
    nonnegative(v, "displacement"),
  );
  return {
    observedLittleIrregularityIndexMm: sum(
      input.independentlyMeasuredFiveMandibularContactDisplacementsMm,
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredFiveMandibularContactDisplacementsMm: [1, 2, 0, 1, 1],
  },
  output: { result: { observedLittleIrregularityIndexMm: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/little-irregularity-index",
  title: "Little Irregularity Index Calculator",
  description:
    "Littlefive-contact mandibular anterior irregularity linear displacement sum, not arch-length shortage, overall malocclusion or treatment need. Actual contact landmarks and measurement independently assessed.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { observedLittleIrregularityIndexMm: { type: "number" } },
        required: ["observedLittleIrregularityIndexMm"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

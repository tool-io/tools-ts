import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly observedValues: readonly number[];
  readonly callerLower: readonly number[];
  readonly callerUpper: readonly number[];
  readonly knownFlags: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "observedValues", label: "Observed values", kind: "numberList" },
  { id: "callerLower", label: "Caller lower", kind: "numberList" },
  { id: "callerUpper", label: "Caller upper", kind: "numberList" },
  { id: "knownFlags", label: "Known flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return observedBands(
    input.observedValues,
    input.callerLower,
    input.callerUpper,
    input.knownFlags,
  );
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedValues: [2, 5],
    callerLower: [1, 1],
    callerUpper: [3, 4],
    knownFlags: [1, 0],
  },
  output: {
    result: {
      signedKnownMargins: [1, 0],
      knownReviewIndices: [],
      unknownIndices: [1],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/monochrome-print-suitability-checker",
  title: "Monochrome Print Suitability Checker",
  description:
    "Audit actual independently measured monochrome hatch visibility/discrimination evidence; not colour-to-gray conversion or print certification. Actual monochrome hatch separability observations against independently verified inclusive caller bands; signed margins and missing observations retained, not conformance/authenticity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedKnownMargins: { type: "array", items: { type: "number" } },
          knownReviewIndices: { type: "array", items: { type: "number" } },
          unknownIndices: { type: "array", items: { type: "number" } },
        },
        required: [
          "signedKnownMargins",
          "knownReviewIndices",
          "unknownIndices",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

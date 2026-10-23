import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyClassifiedJudderPresentationCount: number;
  readonly actualObservedPresentationCount: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualIndependentlyClassifiedJudderPresentationCount",
    label: "Actual independently classified judder presentation count",
    kind: "number",
  },
  {
    id: "actualObservedPresentationCount",
    label: "Actual observed presentation count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  bounded(
    input.actualIndependentlyClassifiedJudderPresentationCount,
    "actualIndependentlyClassifiedJudderPresentationCount",
    0,
    1000000,
  );
  bounded(
    input.actualObservedPresentationCount,
    "actualObservedPresentationCount",
    1,
    1000000,
  );
  if (
    input.actualIndependentlyClassifiedJudderPresentationCount >
    input.actualObservedPresentationCount
  )
    simpleError("counts", "Actualsubset≤presentations.");
  return {
    value:
      (100 * input.actualIndependentlyClassifiedJudderPresentationCount) /
      input.actualObservedPresentationCount,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyClassifiedJudderPresentationCount: 2,
    actualObservedPresentationCount: 4,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/judder-percentage",
  title: "Judder Percentage Calculator",
  description:
    "Observed actual caller-classified judder presentation percentage, same capture/reference criteria, not infer judder from averageFPS.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

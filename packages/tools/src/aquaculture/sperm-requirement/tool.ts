import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedEggCount: number;
  readonly callerIndependentlySpecifiedSpermPerEggRatio: number;
  readonly actualAssayedSpermCountPerMl: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualQualifiedEggCount",
    label: "Actual qualified egg count",
    kind: "number",
  },
  {
    id: "callerIndependentlySpecifiedSpermPerEggRatio",
    label: "Caller independently specified sperm per egg ratio",
    kind: "number",
  },
  {
    id: "actualAssayedSpermCountPerMl",
    label: "Actual assayed sperm count per ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  bounded(input.actualQualifiedEggCount, "actualQualifiedEggCount", 0, 1000000);
  nonnegative(
    input.callerIndependentlySpecifiedSpermPerEggRatio,
    "callerIndependentlySpecifiedSpermPerEggRatio",
  );
  positive(input.actualAssayedSpermCountPerMl, "actualAssayedSpermCountPerMl");
  return {
    value:
      (input.actualQualifiedEggCount *
        input.callerIndependentlySpecifiedSpermPerEggRatio) /
      input.actualAssayedSpermCountPerMl,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedEggCount: 10,
    callerIndependentlySpecifiedSpermPerEggRatio: 2,
    actualAssayedSpermCountPerMl: 4,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/sperm-requirement",
  title: "Sperm Requirement Calculator",
  description:
    "Arithmetic independently animal-care approved actual egg count\u00d7prescribed ratio/assayed viable concentration semenvolume mL, no species ratio selected or in semi nation instructions.",
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

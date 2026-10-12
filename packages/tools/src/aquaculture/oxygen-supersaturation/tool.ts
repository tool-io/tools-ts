import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredDissolvedOxygen: number;
  readonly callerIndependentMatchedEquilibriumSaturation: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualMeasuredDissolvedOxygen",
    label: "Actual measured dissolved oxygen",
    kind: "number",
  },
  {
    id: "callerIndependentMatchedEquilibriumSaturation",
    label: "Caller independent matched equilibrium saturation",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualMeasuredDissolvedOxygen,
    "actualMeasuredDissolvedOxygen",
  );
  positive(
    input.callerIndependentMatchedEquilibriumSaturation,
    "callerIndependentMatchedEquilibriumSaturation",
  );
  return {
    value:
      (100 * input.actualMeasuredDissolvedOxygen) /
      input.callerIndependentMatchedEquilibriumSaturation,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMeasuredDissolvedOxygen: 3,
    callerIndependentMatchedEquilibriumSaturation: 2,
  },
  output: { result: { value: 150 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/oxygen-supersaturation",
  title: "Oxygen Supersaturation Calculator",
  description:
    "Actual oxygen percent of independently temperature/salinity/pressure matched saturation, above100retained; not generic dissolved oxygen demand or safe animal saturation.",
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

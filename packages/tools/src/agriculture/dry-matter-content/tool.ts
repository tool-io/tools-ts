import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredOvenDryMass: number;
  readonly actualMatchedWetSampleMass: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualMeasuredOvenDryMass",
    label: "Actual measured oven dry mass",
    kind: "number",
  },
  {
    id: "actualMatchedWetSampleMass",
    label: "Actual matched wet sample mass",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(input.actualMeasuredOvenDryMass, "actualMeasuredOvenDryMass");
  positive(input.actualMatchedWetSampleMass, "actualMatchedWetSampleMass");
  if (input.actualMeasuredOvenDryMass > input.actualMatchedWetSampleMass)
    simpleError("samples", "Actualdry≤wet.");
  return {
    value:
      (100 * input.actualMeasuredOvenDryMass) /
      input.actualMatchedWetSampleMass,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualMeasuredOvenDryMass: 2, actualMatchedWetSampleMass: 4 },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/dry-matter-content",
  title: "Agriculture Dry Matter Content Calculator",
  description:
    "Actual matched oven-dry/wet sample mass DRY MATTER percentage, not inventory silage amount. Material/constant mass/volatile-loss test method independently applicable; no feed/soil quality judgment.",
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

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualRetrospectivelyRecordedTotalReleasedEnergy: number;
  readonly actualIndependentlyMeasuredBrokenRockVolume: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRetrospectivelyRecordedTotalReleasedEnergy",
    label: "Actual retrospectively recorded total released energy",
    kind: "number",
  },
  {
    id: "actualIndependentlyMeasuredBrokenRockVolume",
    label: "Actual independently measured broken rock volume",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualRetrospectivelyRecordedTotalReleasedEnergy,
    "actualRetrospectivelyRecordedTotalReleasedEnergy",
  );
  positive(
    input.actualIndependentlyMeasuredBrokenRockVolume,
    "actualIndependentlyMeasuredBrokenRockVolume",
  );
  return {
    value:
      input.actualRetrospectivelyRecordedTotalReleasedEnergy /
      input.actualIndependentlyMeasuredBrokenRockVolume,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRetrospectivelyRecordedTotalReleasedEnergy: 10,
    actualIndependentlyMeasuredBrokenRockVolume: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/blast-energy-factor",
  title: "Blast Energy Factor Calculator",
  description:
    "Retrospective actual independently measured total energy/broken volume energy factor, no energy-density recipe, explosive quantities or detonationplanning inferred.",
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

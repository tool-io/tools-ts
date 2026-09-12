import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualRecordedConsumedExplosiveMassKg: number;
  readonly actualIndependentlyMeasuredBrokenRockVolumeCubicMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRecordedConsumedExplosiveMassKg",
    label: "Actual recorded consumed explosive mass kg",
    kind: "number",
  },
  {
    id: "actualIndependentlyMeasuredBrokenRockVolumeCubicMeters",
    label: "Actual independently measured broken rock volume cubic meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualRecordedConsumedExplosiveMassKg,
    "actualRecordedConsumedExplosiveMassKg",
  );
  positive(
    input.actualIndependentlyMeasuredBrokenRockVolumeCubicMeters,
    "actualIndependentlyMeasuredBrokenRockVolumeCubicMeters",
  );
  return {
    value:
      input.actualRecordedConsumedExplosiveMassKg /
      input.actualIndependentlyMeasuredBrokenRockVolumeCubicMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRecordedConsumedExplosiveMassKg: 2,
    actualIndependentlyMeasuredBrokenRockVolumeCubicMeters: 4,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/blast-powder-factor",
  title: "Blast Powder Factor Calculator",
  description:
    "Retrospective measuredpowderfactoractualconsumedkg/independentlysurveyedbrokenm\u00b3. Not selected charge quantity, blast recipe or safe explosive/site authorization.",
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

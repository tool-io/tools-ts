import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualExposedDayCount: number;
  readonly actualCalendarDayCount: number;
  readonly independentlyMeasuredExposureDayDose: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualExposedDayCount",
    label: "Actual exposed day count",
    kind: "number",
  },
  {
    id: "actualCalendarDayCount",
    label: "Actual calendar day count",
    kind: "number",
  },
  {
    id: "independentlyMeasuredExposureDayDose",
    label: "Independently measured exposure day dose",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualCalendarDayCount, "calendar", 1, 1000000);
  bounded(
    input.actualExposedDayCount,
    "exposed",
    0,
    input.actualCalendarDayCount,
  );
  nonnegative(input.independentlyMeasuredExposureDayDose, "dose");
  return {
    conditionalCalendarAverageDose:
      (input.independentlyMeasuredExposureDayDose *
        input.actualExposedDayCount) /
      input.actualCalendarDayCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualExposedDayCount: 2,
    actualCalendarDayCount: 7,
    independentlyMeasuredExposureDayDose: 7,
  },
  output: { result: { conditionalCalendarAverageDose: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/exposure-frequency-adjustment",
  title: "Exposure Frequency Adjustment Calculator",
  description:
    "Actual exposure-day fraction applied to independently measured exposure-day dose, nonexposed days zero under declared scenario. Not actual time-varying calendar integration or a clinical exposure recommendation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  daysBetween,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIceOutIsoDate: string;
  readonly actualNextFreezeIsoDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIceOutIsoDate",
    label: "Actual ice out iso date",
    kind: "string",
  },
  {
    id: "actualNextFreezeIsoDate",
    label: "Actual next freeze iso date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const n = daysBetween(
    input.actualIceOutIsoDate,
    input.actualNextFreezeIsoDate,
  );
  nonnegative(n, "dateorder");
  return { observedIceFreeHalfOpenDays: n };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualIceOutIsoDate: "2026-04-01",
    actualNextFreezeIsoDate: "2026-04-11",
  },
  output: { result: { observedIceFreeHalfOpenDays: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/ice-free-period-days-count",
  title: "Ice Free Period Days Count Calculator",
  description:
    "ActualUTCcivil-date [iceout,nextfreeze)elapsedwhole days acrossyears/leapdates,not forecastfreezestability. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

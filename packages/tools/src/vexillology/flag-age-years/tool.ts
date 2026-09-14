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
  readonly actualAdoptionDate: string;
  readonly actualAsOfDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualAdoptionDate", label: "Actual adoption date", kind: "string" },
  { id: "actualAsOfDate", label: "Actual as of date", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    daysBetween(input.actualAdoptionDate, input.actualAsOfDate),
    "dateorder",
  );
  const a = input.actualAdoptionDate,
    b = input.actualAsOfDate;
  return {
    completedAdoptionAnniversaryYears:
      Number(b.slice(0, 4)) -
      Number(a.slice(0, 4)) -
      (b.slice(5) < a.slice(5) ? 1 : 0),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualAdoptionDate: "2000-10-12", actualAsOfDate: "2026-10-11" },
  output: { result: { completedAdoptionAnniversaryYears: 25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/flag-age-years",
  title: "Flag Age in Years Calculator",
  description:
    "Actualcompletedcivil-yearanniversariesofindependentlyverifiedflagadoption,Feb29anniversaryMarch1nonleap textualmonthday convention,no year-onlyage. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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

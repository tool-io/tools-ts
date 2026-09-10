import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  daysBetween,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedConceptionDate: string;
  readonly asOfDate: string;
  readonly callerVerifiedObstetricOffsetDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEstablishedConceptionDate",
    label: "Independently established conception date",
    kind: "string",
  },
  { id: "asOfDate", label: "As of date", kind: "string" },
  {
    id: "callerVerifiedObstetricOffsetDays",
    label: "Caller verified obstetric offset days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const d = daysBetween(
    input.independentlyEstablishedConceptionDate,
    input.asOfDate,
  );
  bounded(d, "days", 0, 450);
  bounded(input.callerVerifiedObstetricOffsetDays, "offset", 0, 28);
  return {
    conditionalPostConceptionDays: d,
    conditionalObstetricGestationalDays:
      d + input.callerVerifiedObstetricOffsetDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyEstablishedConceptionDate: "2026-01-01",
    asOfDate: "2026-02-01",
    callerVerifiedObstetricOffsetDays: 14,
  },
  output: {
    result: {
      conditionalPostConceptionDays: 31,
      conditionalObstetricGestationalDays: 45,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/gestational-age-from-conception",
  title: "Gestational Age From Conception Calculator",
  description:
    "Actual conception-based calendar age and explicit obstetric offset, not LMPdating or verification of conception/pregnancy. Caller independently establishes actual date/convention.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

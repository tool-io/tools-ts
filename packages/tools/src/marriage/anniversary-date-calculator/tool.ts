import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  calendarAnniversary,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualOriginalAnniversaryDate: string;
  readonly callerTargetYear: number;
  readonly callerFebruary29Policy: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualOriginalAnniversaryDate",
    label: "Actual original anniversary date",
    kind: "string",
  },
  { id: "callerTargetYear", label: "Caller target year", kind: "number" },
  {
    id: "callerFebruary29Policy",
    label: "Caller february29 policy",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return {
    conditionalAnniversaryDate: calendarAnniversary(
      input.actualOriginalAnniversaryDate,
      input.callerTargetYear,
      input.callerFebruary29Policy,
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualOriginalAnniversaryDate: "2024-02-29",
    callerTargetYear: 2025,
    callerFebruary29Policy: "feb28",
  },
  output: { result: { conditionalAnniversaryDate: "2025-02-28" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/anniversary-date-calculator",
  title: "Anniversary Date Calculator",
  description:
    "Gregorian anniversary in explicit year 1\u20139999and callerFeb29policy feb28/mar1; not cultural/legal anniversary definition or timezone conversion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalAnniversaryDate: { type: "string" } },
        required: ["conditionalAnniversaryDate"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

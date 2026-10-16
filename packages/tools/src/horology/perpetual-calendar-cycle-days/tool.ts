import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch51-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  return {
    text: pick(
      input.topic,
      {
        days: "Gregorian400-yearcyclecontains146097days:400*365+97leapdays.",
        limitations:
          "Thiscalendarcycleisnotaperpetual-calendarwatchmechanismguarantee;exceptionstotheGregorianruleandmanualcorrectionsaremanufacturer-specific.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { topic: "days" },
  output: {
    result: {
      text: "Gregorian400-yearcyclecontains146097days:400*365+97leapdays.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horology/perpetual-calendar-cycle-days",
  title: "Perpetual Calendar Cycle Days Calculator",
  description:
    "Bounded offline reference: ExactGregorian400yearcyclearithmeticindependentofwatchmechanism. Only explicit listed topics;not exhaustive/live data or diagnosis,safety/compliance/identity certificate.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { text: { type: "string" } },
        required: ["text"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

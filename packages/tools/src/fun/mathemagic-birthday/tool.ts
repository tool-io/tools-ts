import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  daysBetween,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualBirthMonth: number;
  readonly actualBirthDay: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualBirthMonth", label: "Actual birth month", kind: "number" },
  { id: "actualBirthDay", label: "Actual birth day", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(input.actualBirthMonth, "month", 1, 12);
  bounded(input.actualBirthDay, "day", 1, 31);
  daysBetween(
    `2000-${String(input.actualBirthMonth).padStart(2, "0")}-${String(input.actualBirthDay).padStart(2, "0")}`,
    `2000-${String(input.actualBirthMonth).padStart(2, "0")}-${String(input.actualBirthDay).padStart(2, "0")}`,
  );
  return {
    toyEncodedBirthday: 100 * input.actualBirthMonth + input.actualBirthDay,
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
  input: { actualBirthMonth: 3, actualBirthDay: 14 },
  output: { result: { toyEncodedBirthday: 314 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/mathemagic-birthday",
  title: "Mathemagic Birthday Trick Calculator",
  description:
    "Transparentmonth\u00d7100+day birthdayarithmeticaltrick,no revelationofunknownbirthdate. Offline bounded explicit text/rule convention,not natural-language validity,personaltrait inference or security.",
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

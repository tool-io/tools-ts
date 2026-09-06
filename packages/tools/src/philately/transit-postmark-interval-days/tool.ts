import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, dateOrder } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly firstPostmarkDate: string;
  readonly secondPostmarkDate: string;
}>;
export type Output = Readonly<{ readonly signedTransitCalendarDays: number }>;
const inputFields = [
  { id: "firstPostmarkDate", label: "First postmark date", kind: "string" },
  { id: "secondPostmarkDate", label: "Second postmark date", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    signedTransitCalendarDays: dateOrder(
      input.firstPostmarkDate,
      input.secondPostmarkDate,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstPostmarkDate: "2026-01-01",
  secondPostmarkDate: "2026-01-03",
} satisfies Input;
export const exampleOutput = { signedTransitCalendarDays: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/transit-postmark-interval-days",
  title: "Transit Time Postmark Interval Days Between Marks Calculator",
  description:
    "Retain signed civil-date interval between actual postmarks; not elapsed hours or proof of routing. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedTransitCalendarDays",
      label: "Signed transit calendar days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstPostmarkDate: value.firstPostmarkDate as string,
      secondPostmarkDate: value.secondPostmarkDate as string,
    }),
});
export const run = tool.execute;
export default tool;

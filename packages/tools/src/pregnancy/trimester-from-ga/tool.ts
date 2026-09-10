import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedGestationalDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEstablishedGestationalDays",
    label: "Independently established gestational days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.independentlyEstablishedGestationalDays, "days", 0, 450);
  return {
    conventionalTrimester:
      input.independentlyEstablishedGestationalDays < 98
        ? 1
        : input.independentlyEstablishedGestationalDays < 196
          ? 2
          : 3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyEstablishedGestationalDays: 100 },
  output: { result: { conventionalTrimester: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/trimester-from-ga",
  title: "Trimester From GA Calculator",
  description:
    "Label under explicitly declared completed-week boundaries:first before14weeks, second14through27weeks, third from28weeks. This is a convention, not viability, pregnancy verification or a treatment decision.",
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

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualConfirmedGuestsWhoDidNotAttend: number;
  readonly actualConfirmedGuests: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualConfirmedGuestsWhoDidNotAttend",
    label: "Actual confirmed guests who did not attend",
    kind: "number",
  },
  {
    id: "actualConfirmedGuests",
    label: "Actual confirmed guests",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualConfirmedGuests, "total", 1, 1000000);
  bounded(
    input.actualConfirmedGuestsWhoDidNotAttend,
    "part",
    0,
    input.actualConfirmedGuests,
  );
  nonnegative(input.actualConfirmedGuestsWhoDidNotAttend, "numerator");
  positive(input.actualConfirmedGuests, "denominator");
  return {
    observedRatio:
      (100 * input.actualConfirmedGuestsWhoDidNotAttend) /
      input.actualConfirmedGuests,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualConfirmedGuestsWhoDidNotAttend: 2, actualConfirmedGuests: 4 },
  output: { result: { observedRatio: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/wedding-no-show-rate",
  title: "Wedding No-Show Rate Calculator",
  description:
    "Actual no-show percentage of independently counted confirmed guests. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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

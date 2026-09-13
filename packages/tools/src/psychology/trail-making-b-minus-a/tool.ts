import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualEligibleTrailBSeconds: number;
  readonly actualEligibleTrailASeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualEligibleTrailBSeconds",
    label: "Actual eligible trail b seconds",
    kind: "number",
  },
  {
    id: "actualEligibleTrailASeconds",
    label: "Actual eligible trail a seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualEligibleTrailBSeconds, "actualEligibleTrailBSeconds");
  nonnegative(input.actualEligibleTrailASeconds, "actualEligibleTrailASeconds");
  return {
    value:
      input.actualEligibleTrailBSeconds - input.actualEligibleTrailASeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualEligibleTrailBSeconds: 5, actualEligibleTrailASeconds: 3 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/trail-making-b-minus-a",
  title: "Trail Making B-A Difference Calculator",
  description:
    "Actual TrailMakingBminusAelapsedtime, not performance diagnosis; signed result retained, actual matching units and definitions independently established.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

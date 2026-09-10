import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly firstAdultCount: number;
  readonly additionalAge14PlusCount: number;
  readonly under14Count: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstAdultCount", label: "First adult count", kind: "number" },
  {
    id: "additionalAge14PlusCount",
    label: "Additional age14 plus count",
    kind: "number",
  },
  { id: "under14Count", label: "Under14 count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.firstAdultCount, "firstadult", 1, 1);
  bounded(input.additionalAge14PlusCount, "older", 0, 100);
  bounded(input.under14Count, "younger", 0, 100);
  return {
    modifiedOecdEquivalenceUnits:
      1 + 0.5 * input.additionalAge14PlusCount + 0.3 * input.under14Count,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { firstAdultCount: 1, additionalAge14PlusCount: 1, under14Count: 2 },
  output: { result: { modifiedOecdEquivalenceUnits: 2.1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/oecd-modified-equivalisation-scale",
  title: "OECD Modified Equivalisation Scale Calculator",
  description:
    "Conventional modified OECDhousehold scale:1first adult,.5each additional14+person,.3each under14person. Caller independently establishes household/age classification; not actual costs or household wellbeing.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

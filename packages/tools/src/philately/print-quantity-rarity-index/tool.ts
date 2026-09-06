import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positiveCounts } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly issuePrintQuantity: number;
  readonly referencePrintQuantity: number;
}>;
export type Output = Readonly<{ readonly inversePrintQuantityIndex: number }>;
const inputFields = [
  { id: "issuePrintQuantity", label: "Issue print quantity", kind: "number" },
  {
    id: "referencePrintQuantity",
    label: "Reference print quantity",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positiveCounts([input.issuePrintQuantity, input.referencePrintQuantity]);
  return {
    inversePrintQuantityIndex:
      input.referencePrintQuantity / input.issuePrintQuantity,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  issuePrintQuantity: 2000,
  referencePrintQuantity: 10000,
} satisfies Input;
export const exampleOutput = { inversePrintQuantityIndex: 5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/print-quantity-rarity-index",
  title: "Print Quantity Rarity Index Scorer",
  description:
    "Report inverse print-run ratio to a caller reference, not surviving population, scarcity or a price prediction. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "inversePrintQuantityIndex",
      label: "Inverse print quantity index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      issuePrintQuantity: value.issuePrintQuantity as number,
      referencePrintQuantity: value.referencePrintQuantity as number,
    }),
});
export const run = tool.execute;
export default tool;

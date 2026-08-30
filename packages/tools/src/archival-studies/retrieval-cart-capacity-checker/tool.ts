import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, count } from "../shared.js";
export type Input = Readonly<{
  readonly orderedBoxMassesKg: readonly number[];
  readonly cartDeclaredGrossMassLimitKg: number;
  readonly cartTareKg: number;
  readonly callerMaximumCartBoxCount: number;
}>;
export type Output = Readonly<{
  readonly maximumOrderedCartBoxPrefixCount: number;
  readonly modeledLoadedCartGrossMassKg: number;
  readonly unusedDeclaredPayloadKg: number;
}>;
const inputFields = [
  {
    id: "orderedBoxMassesKg",
    label: "Ordered box masses kg",
    kind: "numberList",
  },
  {
    id: "cartDeclaredGrossMassLimitKg",
    label: "Cart declared gross mass limit kg",
    kind: "number",
  },
  { id: "cartTareKg", label: "Cart tare kg", kind: "number" },
  {
    id: "callerMaximumCartBoxCount",
    label: "Caller maximum cart box count",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.orderedBoxMassesKg.forEach((v) => nonnegative(v, "orderedBoxMassesKg"));
  nonnegative(
    input.cartDeclaredGrossMassLimitKg,
    "cartDeclaredGrossMassLimitKg",
  );
  nonnegative(input.cartTareKg, "cartTareKg");
  count(input.callerMaximumCartBoxCount, "callerMaximumCartBoxCount");
  const capacity = nonnegative(
    input.cartDeclaredGrossMassLimitKg - input.cartTareKg,
    "tare",
  );
  let used = 0,
    n = 0;
  for (const mass of input.orderedBoxMassesKg) {
    if (n >= input.callerMaximumCartBoxCount || mass > capacity - used) break;
    used += mass;
    n++;
  }
  return {
    maximumOrderedCartBoxPrefixCount: n,
    modeledLoadedCartGrossMassKg: input.cartTareKg + used,
    unusedDeclaredPayloadKg: capacity - used,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  orderedBoxMassesKg: [10, 20, 15],
  cartDeclaredGrossMassLimitKg: 50,
  cartTareKg: 10,
  callerMaximumCartBoxCount: 5,
} satisfies Input;
export const exampleOutput = {
  maximumOrderedCartBoxPrefixCount: 2,
  modeledLoadedCartGrossMassKg: 40,
  unusedDeclaredPayloadKg: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/retrieval-cart-capacity-checker",
  title: "Retrieval Cart Load Capacity Box Limit Checker",
  description:
    "Fit ordered retrieval-box prefix under separately declared gross-minus-tare and count limits; no cart strength, center-of-gravity or manual-handling safety evaluation.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumOrderedCartBoxPrefixCount",
      label: "Maximum ordered cart box prefix count",
      kind: "number",
    },
    {
      id: "modeledLoadedCartGrossMassKg",
      label: "Modeled loaded cart gross mass kg",
      kind: "number",
    },
    {
      id: "unusedDeclaredPayloadKg",
      label: "Unused declared payload kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      orderedBoxMassesKg: value.orderedBoxMassesKg as readonly number[],
      cartDeclaredGrossMassLimitKg:
        value.cartDeclaredGrossMassLimitKg as number,
      cartTareKg: value.cartTareKg as number,
      callerMaximumCartBoxCount: value.callerMaximumCartBoxCount as number,
    }),
});
export const run = tool.execute;
export default tool;

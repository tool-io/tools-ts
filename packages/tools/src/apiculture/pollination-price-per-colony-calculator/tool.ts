import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly contractCostComponents: readonly number[];
  readonly colonyCount: number;
  readonly targetSalesMarginFraction: number;
  readonly offeredPricePerColony: number;
}>;
export type Output = Readonly<{
  readonly requiredPricePerColony: number;
  readonly totalContractCost: number;
  readonly offeredContractContribution: number;
}>;
const inputFields = [
  {
    id: "contractCostComponents",
    label: "Contract cost components",
    kind: "numberList",
  },
  { id: "colonyCount", label: "Colony count", kind: "integer" },
  {
    id: "targetSalesMarginFraction",
    label: "Target sales margin fraction",
    kind: "number",
  },
  {
    id: "offeredPricePerColony",
    label: "Offered price per colony",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.colonyCount, "colonyCount");
  input.contractCostComponents.forEach((v) =>
    nonnegative(v, "contractCostComponents"),
  );
  nonnegative(input.offeredPricePerColony, "offeredPricePerColony");
  fraction(input.targetSalesMarginFraction, "targetSalesMarginFraction");
  count(input.colonyCount, "colonyCount");
  if (
    !input.contractCostComponents.length ||
    input.targetSalesMarginFraction === 1
  )
    simpleError(
      "targetSalesMarginFraction",
      "Nonempty costs and sales margin below one required.",
    );
  const totalContractCost = input.contractCostComponents.reduce(
    (a, b) => a + b,
    0,
  );
  return {
    requiredPricePerColony:
      totalContractCost /
      ((1 - input.targetSalesMarginFraction) * input.colonyCount),
    totalContractCost,
    offeredContractContribution:
      input.offeredPricePerColony * input.colonyCount - totalContractCost,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  contractCostComponents: [100, 800, 300, 200],
  colonyCount: 10,
  targetSalesMarginFraction: 0.2,
  offeredPricePerColony: 150,
} satisfies Input;
export const exampleOutput = {
  requiredPricePerColony: 175,
  totalContractCost: 1400,
  offeredContractContribution: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/pollination-price-per-colony-calculator",
  title: "Pollination Price Per Colony",
  description:
    "Invert caller pollination contract costs and desired margin on sales to per-colony price; no prevailing rental price, taxes or guaranteed service performance.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredPricePerColony",
      label: "Required price per colony",
      kind: "number",
    },
    { id: "totalContractCost", label: "Total contract cost", kind: "number" },
    {
      id: "offeredContractContribution",
      label: "Offered contract contribution",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      contractCostComponents: value.contractCostComponents as readonly number[],
      colonyCount: value.colonyCount as number,
      targetSalesMarginFraction: value.targetSalesMarginFraction as number,
      offeredPricePerColony: value.offeredPricePerColony as number,
    }),
});
export const run = tool.execute;
export default tool;

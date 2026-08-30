import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, money } from "../batch-shared.js";
export type Input = Readonly<{
  readonly recordedCostMinor: number;
  readonly replacementCostMinor: number;
  readonly nrvCeilingMinor: number;
  readonly normalProfitMinor: number;
}>;
export type Output = Readonly<{
  readonly marketFloorMinor: number;
  readonly designatedMarketMinor: number;
  readonly lowerCostOrMarketCarryingMinor: number;
  readonly inventoryWriteDownMinor: number;
}>;
const inputFields = [
  { id: "recordedCostMinor", label: "Recorded cost minor", kind: "number" },
  {
    id: "replacementCostMinor",
    label: "Replacement cost minor",
    kind: "number",
  },
  { id: "nrvCeilingMinor", label: "Nrv ceiling minor", kind: "number" },
  { id: "normalProfitMinor", label: "Normal profit minor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.recordedCostMinor, "recordedCostMinor");
  money(input.replacementCostMinor, "replacementCostMinor");
  money(input.nrvCeilingMinor, "nrvCeilingMinor");
  money(input.normalProfitMinor, "normalProfitMinor");
  if (input.normalProfitMinor > input.nrvCeilingMinor)
    simpleError(
      "profit",
      "Nonnegative NRV-minus-normal-profit floor required by this caller LCM model.",
    );
  const floor = input.nrvCeilingMinor - input.normalProfitMinor,
    market = Math.max(
      floor,
      Math.min(input.replacementCostMinor, input.nrvCeilingMinor),
    ),
    carry = Math.min(input.recordedCostMinor, market);
  return {
    marketFloorMinor: floor,
    designatedMarketMinor: market,
    lowerCostOrMarketCarryingMinor: carry,
    inventoryWriteDownMinor: input.recordedCostMinor - carry,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  recordedCostMinor: 100,
  replacementCostMinor: 60,
  nrvCeilingMinor: 80,
  normalProfitMinor: 10,
} satisfies Input;
export const exampleOutput = {
  marketFloorMinor: 70,
  designatedMarketMinor: 70,
  lowerCostOrMarketCarryingMinor: 70,
  inventoryWriteDownMinor: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/lower-of-cost-or-market-write-down-checker",
  title: "Lower Of Cost Or Market Write Down Checker",
  description:
    "Apply declared replacement-cost LCM ceiling/floor model (NRV and NRV−normal-profit) without confusing it with lower-cost-NRV; applicable reporting framework/inventory method remains caller responsibility.",
  inputs: inputFields,
  outputs: [
    { id: "marketFloorMinor", label: "Market floor minor", kind: "number" },
    {
      id: "designatedMarketMinor",
      label: "Designated market minor",
      kind: "number",
    },
    {
      id: "lowerCostOrMarketCarryingMinor",
      label: "Lower cost or market carrying minor",
      kind: "number",
    },
    {
      id: "inventoryWriteDownMinor",
      label: "Inventory write down minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      recordedCostMinor: value.recordedCostMinor as number,
      replacementCostMinor: value.replacementCostMinor as number,
      nrvCeilingMinor: value.nrvCeilingMinor as number,
      normalProfitMinor: value.normalProfitMinor as number,
    }),
});
export const run = tool.execute;
export default tool;

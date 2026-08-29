import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DisposalGainLossInput = {
  readonly accumulatedDepreciation: number;
  readonly cost: number;
  readonly saleProceeds: number;
};

export type DisposalGainLossOutput = {
  readonly bookValue: number;
  readonly gainOrLoss: number;
};

export const disposalGainLossExample = {
  input: {
    accumulatedDepreciation: 65000,
    cost: 150000,
    saleProceeds: 95000,
  },
  output: { bookValue: 85000, gainOrLoss: 10000 },
} satisfies ToolExample<DisposalGainLossInput, DisposalGainLossOutput>;

export const calculateDisposalGainLoss = (
  input: DisposalGainLossInput,
): DisposalGainLossOutput => {
  if (!Number.isFinite(input.cost) || input.cost < 0)
    simpleError(
      "cost",
      "The asset cost must be a finite non-negative number.",
      "invalid_cost",
    );
  if (
    !Number.isFinite(input.accumulatedDepreciation) ||
    input.accumulatedDepreciation < 0
  )
    simpleError(
      "accumulatedDepreciation",
      "Accumulated depreciation must be a finite non-negative number.",
      "invalid_accumulated_depreciation",
    );
  if (input.accumulatedDepreciation > input.cost)
    simpleError(
      "accumulatedDepreciation",
      "Accumulated depreciation must not exceed the asset cost.",
      "accumulated_exceeds_cost",
    );
  if (!Number.isFinite(input.saleProceeds))
    simpleError(
      "saleProceeds",
      "The sale proceeds must be a finite number.",
      "invalid_sale_proceeds",
    );
  const bookValue = input.cost - input.accumulatedDepreciation;
  const gainOrLoss = input.saleProceeds - bookValue;
  return {
    bookValue: bookValue === 0 ? 0 : bookValue,
    gainOrLoss: gainOrLoss === 0 ? 0 : gainOrLoss,
  };
};

export const disposalGainLossTool = createSimpleTool({
  calculate: (input) =>
    calculateDisposalGainLoss({
      accumulatedDepreciation: input.accumulatedDepreciation as number,
      cost: input.cost as number,
      saleProceeds: input.saleProceeds as number,
    }),
  description:
    "Determine the gain or loss on disposing of a depreciable asset: book value as cost minus accumulated depreciation, then sale proceeds minus book value.",
  id: "accounting/disposal-gain-loss-book-value-netting",
  inputs: [
    {
      description: "Original capitalized cost of the asset.",
      id: "cost",
      kind: "number",
      label: "Cost",
      minimum: 0,
    },
    {
      description:
        "Accumulated depreciation through the disposal date; must not exceed cost.",
      id: "accumulatedDepreciation",
      kind: "number",
      label: "Accumulated depreciation",
      minimum: 0,
    },
    {
      description:
        "Cash or consideration received on disposal; a negative value represents consideration paid to dispose.",
      id: "saleProceeds",
      kind: "number",
      label: "Sale proceeds",
    },
  ],
  outputs: [
    {
      description:
        "Net book value of the asset at disposal, cost less accumulated depreciation.",
      id: "bookValue",
      kind: "number",
      label: "Book value",
    },
    {
      description:
        "Gain when positive or loss when negative on disposal, proceeds minus book value.",
      id: "gainOrLoss",
      kind: "number",
      label: "Gain or loss",
    },
  ],
  title: "Disposal Gain or Loss Calculator",
});
export const runDisposalGainLoss = disposalGainLossTool.execute;
export default disposalGainLossTool;

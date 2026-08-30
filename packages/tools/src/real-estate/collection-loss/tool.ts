import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CollectionLossInput = Readonly<{
  readonly billedRent: number;
  readonly lossPercent: number;
}>;
export type CollectionLossOutput = Readonly<{
  readonly collectionLoss: number;
}>;

export const calculateCollectionLoss = (
  x: CollectionLossInput,
): CollectionLossOutput => {
  if (!Number.isFinite(x.billedRent) || x.billedRent < 0)
    simpleError("billedRent", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.lossPercent) || x.lossPercent < 0)
    simpleError("lossPercent", "Provide a finite nonnegative number.");
  if (!(x.lossPercent <= 100))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const collectionLoss = (x.billedRent * x.lossPercent) / 100;
  if (!Number.isFinite(collectionLoss))
    simpleError(
      "collectionLoss",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { collectionLoss: Object.is(collectionLoss, -0) ? 0 : collectionLoss };
};

export const example = {
  input: {
    billedRent: 100000,
    lossPercent: 2,
  },
  output: { collectionLoss: 2000 },
} satisfies ToolExample<CollectionLossInput, CollectionLossOutput>;

export const tool = createSimpleTool({
  id: "real-estate/collection-loss",
  title: "Collection Loss",
  description:
    "Expected uncollected rent from billed rent and a supplied loss percentage.",
  inputs: [
    {
      id: "billedRent",
      kind: "number",
      label: "Billed Rent",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "lossPercent",
      kind: "number",
      label: "Loss Percent",
      unit: "percent",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "collectionLoss",
      kind: "number",
      label: "Collection Loss",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateCollectionLoss({
      billedRent: input.billedRent as number,
      lossPercent: input.lossPercent as number,
    }),
});
export const collectionLossTool = tool;
export const runCollectionLoss = tool.execute;
export default tool;

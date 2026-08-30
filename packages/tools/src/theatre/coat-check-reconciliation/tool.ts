import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly ticketsIssued: number;
  readonly itemsAccepted: number;
  readonly ticketsReturned: number;
  readonly itemsReleased: number;
  readonly unclaimedItems: number;
}>;
export type Output = Readonly<{
  readonly intakeDifference: number;
  readonly releaseDifference: number;
  readonly inventoryDifference: number;
  readonly reconciled: boolean;
}>;

export const calculate = (input: Input): Output => {
  const intakeDifference = input.ticketsIssued - input.itemsAccepted,
    releaseDifference = input.ticketsReturned - input.itemsReleased,
    inventoryDifference =
      input.itemsAccepted - input.itemsReleased - input.unclaimedItems;
  return {
    intakeDifference,
    releaseDifference,
    inventoryDifference,
    reconciled:
      intakeDifference === 0 &&
      releaseDifference === 0 &&
      inventoryDifference === 0,
  };
};

export const exampleInput = {
  ticketsIssued: 100,
  itemsAccepted: 100,
  ticketsReturned: 95,
  itemsReleased: 95,
  unclaimedItems: 5,
} satisfies Input;
export const exampleOutput = {
  intakeDifference: 0,
  releaseDifference: 0,
  inventoryDifference: 0,
  reconciled: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      ticketsIssued: input.ticketsIssued as number,
      itemsAccepted: input.itemsAccepted as number,
      ticketsReturned: input.ticketsReturned as number,
      itemsReleased: input.itemsReleased as number,
      unclaimedItems: input.unclaimedItems as number,
    }),
  description:
    "Reconcile coat-check tickets, released items, and unclaimed inventory.",
  id: "theatre/coat-check-reconciliation",
  inputs: [
    {
      id: "ticketsIssued",
      label: "Coat-check tickets issued",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "itemsAccepted",
      label: "Items accepted",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "ticketsReturned",
      label: "Tickets returned",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "itemsReleased",
      label: "Items released",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "unclaimedItems",
      label: "Unclaimed items",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "intakeDifference",
      label: "Tickets minus accepted items",
      kind: "integer",
    },
    {
      id: "releaseDifference",
      label: "Returned tickets minus released items",
      kind: "integer",
    },
    {
      id: "inventoryDifference",
      label: "Expected minus unclaimed inventory",
      kind: "integer",
    },
    { id: "reconciled", label: "Coat check reconciles", kind: "boolean" },
  ],
  title: "Coat-Check Reconciliation",
});

export const run = tool.execute;
export default tool;

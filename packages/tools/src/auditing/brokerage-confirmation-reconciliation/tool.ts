import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly ledgerHoldingsValue: number;
  readonly brokerConfirmedValue: number;
  readonly custodianConfirmedValue: number;
  readonly tolerance: number;
}>;
export type Output = Readonly<{
  readonly brokerDifference: number;
  readonly custodianDifference: number;
  readonly confirmationSpread: number;
  readonly reconciled: boolean;
}>;

export const calculate = (input: Input): Output => {
  const brokerDifference =
      input.brokerConfirmedValue - input.ledgerHoldingsValue,
    custodianDifference =
      input.custodianConfirmedValue - input.ledgerHoldingsValue,
    confirmationSpread = Math.abs(
      input.brokerConfirmedValue - input.custodianConfirmedValue,
    );
  return {
    brokerDifference,
    custodianDifference,
    confirmationSpread,
    reconciled:
      Math.abs(brokerDifference) <= input.tolerance &&
      Math.abs(custodianDifference) <= input.tolerance,
  };
};

export const exampleInput = {
  ledgerHoldingsValue: 1000,
  brokerConfirmedValue: 1002,
  custodianConfirmedValue: 999,
  tolerance: 3,
} satisfies Input;
export const exampleOutput = {
  brokerDifference: 2,
  custodianDifference: -1,
  confirmationSpread: 3,
  reconciled: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      ledgerHoldingsValue: input.ledgerHoldingsValue as number,
      brokerConfirmedValue: input.brokerConfirmedValue as number,
      custodianConfirmedValue: input.custodianConfirmedValue as number,
      tolerance: input.tolerance as number,
    }),
  description:
    "Reconcile brokerage and custody confirmations with ledger holdings.",
  id: "auditing/brokerage-confirmation-reconciliation",
  inputs: [
    {
      id: "ledgerHoldingsValue",
      label: "Ledger holdings value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "brokerConfirmedValue",
      label: "Broker-confirmed value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "custodianConfirmedValue",
      label: "Custodian-confirmed value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "tolerance",
      label: "Allowed difference",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "brokerDifference",
      label: "Broker minus ledger difference",
      kind: "number",
    },
    {
      id: "custodianDifference",
      label: "Custodian minus ledger difference",
      kind: "number",
    },
    {
      id: "confirmationSpread",
      label: "Broker-custodian spread",
      kind: "number",
      minimum: 0,
    },
    { id: "reconciled", label: "Confirmations reconcile", kind: "boolean" },
  ],
  title: "Brokerage Confirmation Reconciliation",
});

export const run = tool.execute;
export default tool;

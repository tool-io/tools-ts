import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly balanceMinor: number;
  readonly receivedMinor: number;
  readonly spentMinor: number;
};
export type Output = {
  readonly nextBalanceMinor: number;
  readonly solvent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    balanceMinor: { type: "integer" },
    receivedMinor: { type: "integer", minimum: 0 },
    spentMinor: { type: "integer", minimum: 0 },
  },
  required: ["balanceMinor", "receivedMinor", "spentMinor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nextBalanceMinor: { type: "integer" },
    solvent: { type: "boolean" },
  },
  required: ["nextBalanceMinor", "solvent"],
} as const;
/** Calculate story money ledger one transaction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { balanceMinor, receivedMinor, spentMinor } = request;
  const compute = (): Output => {
    H.integer(receivedMinor, 0);
    H.integer(spentMinor, 0);
    return {
      nextBalanceMinor: balanceMinor + receivedMinor - spentMinor,
      solvent: balanceMinor + receivedMinor >= spentMinor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { balanceMinor: 100, receivedMinor: 20, spentMinor: 80 },
  output: { nextBalanceMinor: 40, solvent: true },
} satisfies ToolExample<Input, Output>;
export const storyMoneyLedgerOneTransactionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/story-money-ledger-one-transaction",
    title: "Story Money Ledger One Transaction Tool",
    description:
      "Calculate story money ledger one transaction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        balanceMinor: { type: "integer" },
        receivedMinor: { type: "integer", minimum: 0 },
        spentMinor: { type: "integer", minimum: 0 },
      },
      required: ["balanceMinor", "receivedMinor", "spentMinor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nextBalanceMinor: { type: "integer" },
        solvent: { type: "boolean" },
      },
      required: ["nextBalanceMinor", "solvent"],
    },
    ports: {
      inputs: [
        {
          id: "balanceMinor",
          label: "Balance Minor",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "receivedMinor",
          label: "Received Minor",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "spentMinor",
          label: "Spent Minor",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nextBalanceMinor",
          label: "Next Balance Minor",
          valueType: { type: "integer" },
        },
        { id: "solvent", label: "Solvent", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = storyMoneyLedgerOneTransactionTool.execute;
export default storyMoneyLedgerOneTransactionTool;

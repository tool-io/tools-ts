import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initial: number;
  readonly received: number;
  readonly removed: number;
  readonly observed: number;
};
export type Output = {
  readonly expectedDecimal: string;
  readonly residualDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initial: { type: "integer", minimum: 0 },
    received: { type: "integer", minimum: 0 },
    removed: { type: "integer", minimum: 0 },
    observed: { type: "integer", minimum: 0 },
  },
  required: ["initial", "received", "removed", "observed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedDecimal: { type: "string", maxLength: 8192 },
    residualDecimal: { type: "string", maxLength: 8192 },
  },
  required: ["expectedDecimal", "residualDecimal"],
} as const;
/** Audit exact benign inventory counts without identifying or manipulating biological material. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initial, received, removed, observed } = request;
  const compute = (): Output => {
    H.integer(initial, 0);
    H.integer(received, 0);
    H.integer(removed, 0);
    H.integer(observed, 0);
    return {
      expectedDecimal: (
        BigInt(initial) +
        BigInt(received) -
        BigInt(removed)
      ).toString(),
      residualDecimal: (
        BigInt(observed) -
        BigInt(initial) -
        BigInt(received) +
        BigInt(removed)
      ).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initial: 100, received: 20, removed: 30, observed: 88 },
  output: { expectedDecimal: "90", residualDecimal: "-2" },
} satisfies ToolExample<Input, Output>;
export const benignInventoryBalanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosecurity/benign-inventory-balance-term",
    title: "Benign Inventory Balance Term Tool",
    description:
      "Audit exact benign inventory counts without identifying or manipulating biological material.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initial: { type: "integer", minimum: 0 },
        received: { type: "integer", minimum: 0 },
        removed: { type: "integer", minimum: 0 },
        observed: { type: "integer", minimum: 0 },
      },
      required: ["initial", "received", "removed", "observed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedDecimal: { type: "string", maxLength: 8192 },
        residualDecimal: { type: "string", maxLength: 8192 },
      },
      required: ["expectedDecimal", "residualDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "initial",
          label: "Initial",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "received",
          label: "Received",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "removed",
          label: "Removed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "expectedDecimal",
          label: "Expected Decimal",
          valueType: { type: "string" },
        },
        {
          id: "residualDecimal",
          label: "Residual Decimal",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = benignInventoryBalanceTermTool.execute;
export default benignInventoryBalanceTermTool;

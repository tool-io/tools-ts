import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingUnits: number;
  readonly receivedUnits: number;
  readonly usedUnits: number;
  readonly discardedUnits: number;
};
export type Output = { readonly closingUnits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingUnits: { type: "integer", minimum: 0 },
    receivedUnits: { type: "integer", minimum: 0 },
    usedUnits: { type: "integer", minimum: 0 },
    discardedUnits: { type: "integer", minimum: 0 },
  },
  required: ["openingUnits", "receivedUnits", "usedUnits", "discardedUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingUnits: { type: "integer" } },
  required: ["closingUnits"],
} as const;
/** Reconcile explicit prosthetic-repair inventory movements while retaining a signed discrepancy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingUnits, receivedUnits, usedUnits, discardedUnits } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingUnits) &&
        openingUnits >= 0 &&
        openingUnits <= Number.MAX_SAFE_INTEGER,
      "openingUnits",
    ),
      openingUnits);
    (H.domain(
      Number.isSafeInteger(receivedUnits) &&
        receivedUnits >= 0 &&
        receivedUnits <= Number.MAX_SAFE_INTEGER,
      "receivedUnits",
    ),
      receivedUnits);
    (H.domain(
      Number.isSafeInteger(usedUnits) &&
        usedUnits >= 0 &&
        usedUnits <= Number.MAX_SAFE_INTEGER,
      "usedUnits",
    ),
      usedUnits);
    (H.domain(
      Number.isSafeInteger(discardedUnits) &&
        discardedUnits >= 0 &&
        discardedUnits <= Number.MAX_SAFE_INTEGER,
      "discardedUnits",
    ),
      discardedUnits);
    return {
      closingUnits: Number(
        BigInt(openingUnits) +
          BigInt(receivedUnits) -
          BigInt(usedUnits) -
          BigInt(discardedUnits),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingUnits: 10,
    receivedUnits: 5,
    usedUnits: 4,
    discardedUnits: 1,
  },
  output: { closingUnits: 10 },
} satisfies ToolExample<Input, Output>;
export const prostheticRepairInventoryBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["prosthodontics", "health and medicine"],
      keywords: ["prosthodontics", "health and medicine"],
    },
    id: "prosthodontics/prosthetic-repair-inventory-balance",
    title: "Prosthetic Repair Inventory Balance",
    description:
      "Reconcile explicit prosthetic-repair inventory movements while retaining a signed discrepancy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingUnits: { type: "integer", minimum: 0 },
        receivedUnits: { type: "integer", minimum: 0 },
        usedUnits: { type: "integer", minimum: 0 },
        discardedUnits: { type: "integer", minimum: 0 },
      },
      required: [
        "openingUnits",
        "receivedUnits",
        "usedUnits",
        "discardedUnits",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closingUnits: { type: "integer" } },
      required: ["closingUnits"],
    },
    ports: {
      inputs: [
        {
          id: "openingUnits",
          label: "Opening Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "receivedUnits",
          label: "Received Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "usedUnits",
          label: "Used Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "discardedUnits",
          label: "Discarded Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "closingUnits",
          label: "Closing Units",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = prostheticRepairInventoryBalanceTool.execute;
export default prostheticRepairInventoryBalanceTool;

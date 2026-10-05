import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly purchasedEntries: number;
  readonly usedEntries: number;
  readonly requestedEntries: number;
};
export type Output = {
  readonly remainingEntries: number;
  readonly requestCovered: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purchasedEntries: { type: "integer", minimum: 0 },
    usedEntries: { type: "integer", minimum: 0 },
    requestedEntries: { type: "integer", minimum: 0 },
  },
  required: ["purchasedEntries", "usedEntries", "requestedEntries"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingEntries: { type: "integer" },
    requestCovered: { type: "boolean" },
  },
  required: ["remainingEntries", "requestCovered"],
} as const;
/** Check a requested entry count against an explicitly recorded tourist-pass entry balance without reserving or redeeming entries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { purchasedEntries, usedEntries, requestedEntries } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(purchasedEntries) &&
        purchasedEntries >= 0 &&
        purchasedEntries <= Number.MAX_SAFE_INTEGER,
      "purchasedEntries",
    ),
      purchasedEntries);
    (H.domain(
      Number.isSafeInteger(usedEntries) &&
        usedEntries >= 0 &&
        usedEntries <= purchasedEntries,
      "usedEntries",
    ),
      usedEntries);
    (H.domain(
      Number.isSafeInteger(requestedEntries) &&
        requestedEntries >= 0 &&
        requestedEntries <= Number.MAX_SAFE_INTEGER,
      "requestedEntries",
    ),
      requestedEntries);
    return {
      remainingEntries: purchasedEntries - usedEntries,
      requestCovered: requestedEntries <= purchasedEntries - usedEntries,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { purchasedEntries: 10, usedEntries: 4, requestedEntries: 3 },
  output: { remainingEntries: 6, requestCovered: true },
} satisfies ToolExample<Input, Output>;
export const touristPassEntryCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "tourism/tourist-pass-entry-credit",
    title: "Tourist Pass Entry Credit Tool",
    description:
      "Check a requested entry count against an explicitly recorded tourist-pass entry balance without reserving or redeeming entries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purchasedEntries: { type: "integer", minimum: 0 },
        usedEntries: { type: "integer", minimum: 0 },
        requestedEntries: { type: "integer", minimum: 0 },
      },
      required: ["purchasedEntries", "usedEntries", "requestedEntries"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingEntries: { type: "integer" },
        requestCovered: { type: "boolean" },
      },
      required: ["remainingEntries", "requestCovered"],
    },
    ports: {
      inputs: [
        {
          id: "purchasedEntries",
          label: "Purchased Entries",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "usedEntries",
          label: "Used Entries",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "requestedEntries",
          label: "Requested Entries",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingEntries",
          label: "Remaining Entries",
          valueType: { type: "integer" },
        },
        {
          id: "requestCovered",
          label: "Request Covered",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = touristPassEntryCreditTool.execute;
export default touristPassEntryCreditTool;

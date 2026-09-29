import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lotIds: readonly string[];
  readonly expiryDayIndices: readonly number[];
};
export type Output = {
  readonly earliestLots: readonly string[];
  readonly tie: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lotIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    expiryDayIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["lotIds", "expiryDayIndices"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestLots: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    tie: { type: "boolean" },
  },
  required: ["earliestLots", "tie"],
} as const;
/** Identify supplied earliest expiry-index ties without deciding whether stock may be dispensed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lotIds, expiryDayIndices } = request;
  const compute = (): Output => {
    H.sameLength(lotIds, expiryDayIndices);
    H.domain(lotIds.length > 0);
    const first = Math.min(...expiryDayIndices),
      earliestLots = lotIds.filter((_, i) => expiryDayIndices[i] === first);
    return { earliestLots, tie: earliestLots.length > 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lotIds: ["A", "B", "C"], expiryDayIndices: [10, 8, 8] },
  output: { earliestLots: ["B", "C"], tie: true },
} satisfies ToolExample<Input, Output>;
export const medicineLotExpiryTieTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/medicine-lot-expiry-tie-token",
    title: "Medicine Lot Expiry Tie Token Tool",
    description:
      "Identify supplied earliest expiry-index ties without deciding whether stock may be dispensed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lotIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        expiryDayIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["lotIds", "expiryDayIndices"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestLots: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        tie: { type: "boolean" },
      },
      required: ["earliestLots", "tie"],
    },
    ports: {
      inputs: [
        {
          id: "lotIds",
          label: "Lot Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "expiryDayIndices",
          label: "Expiry Day Indices",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "earliestLots",
          label: "Earliest Lots",
          valueType: { type: "list", items: { type: "string" } },
        },
        { id: "tie", label: "Tie", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = medicineLotExpiryTieTokenTool.execute;
export default medicineLotExpiryTieTokenTool;

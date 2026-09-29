import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedIds: readonly string[];
  readonly pickedIds: readonly string[];
  readonly capacity: number;
};
export type Output = {
  readonly unpicked: readonly string[];
  readonly unexpected: readonly string[];
  readonly pickedDistinct: number;
  readonly exceedsCapacity: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    pickedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    capacity: { type: "integer", minimum: 0 },
  },
  required: ["requestedIds", "pickedIds", "capacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unpicked: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    unexpected: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    pickedDistinct: { type: "integer" },
    exceedsCapacity: { type: "boolean" },
  },
  required: ["unpicked", "unexpected", "pickedDistinct", "exceedsCapacity"],
} as const;
/** Reconcile picklist line identities with tote line capacity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestedIds, pickedIds, capacity } = request;
  const compute = (): Output => {
    H.integer(capacity, 0);
    const picked = [...new Set(pickedIds)];
    return {
      unpicked: [...new Set(requestedIds)].filter((x) => !picked.includes(x)),
      unexpected: picked.filter((x) => !requestedIds.includes(x)),
      pickedDistinct: picked.length,
      exceedsCapacity: picked.length > capacity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requestedIds: ["A", "B", "C"],
    pickedIds: ["B", "D", "B"],
    capacity: 2,
  },
  output: {
    unpicked: ["A", "C"],
    unexpected: ["D"],
    pickedDistinct: 2,
    exceedsCapacity: false,
  },
} satisfies ToolExample<Input, Output>;
export const pharmacyTotePicklistLineCountBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hospital-pharmacy/pharmacy-tote-picklist-line-count-budget",
      title: "Pharmacy Tote Picklist Line Count Budget Tool",
      description:
        "Reconcile picklist line identities with tote line capacity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          requestedIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          pickedIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          capacity: { type: "integer", minimum: 0 },
        },
        required: ["requestedIds", "pickedIds", "capacity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unpicked: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          unexpected: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          pickedDistinct: { type: "integer" },
          exceedsCapacity: { type: "boolean" },
        },
        required: [
          "unpicked",
          "unexpected",
          "pickedDistinct",
          "exceedsCapacity",
        ],
      },
      ports: {
        inputs: [
          {
            id: "requestedIds",
            label: "Requested Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "pickedIds",
            label: "Picked Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "capacity",
            label: "Capacity",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "unpicked",
            label: "Unpicked",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "unexpected",
            label: "Unexpected",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "pickedDistinct",
            label: "Picked Distinct",
            valueType: { type: "integer" },
          },
          {
            id: "exceedsCapacity",
            label: "Exceeds Capacity",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmacyTotePicklistLineCountBudgetTool.execute;
export default pharmacyTotePicklistLineCountBudgetTool;

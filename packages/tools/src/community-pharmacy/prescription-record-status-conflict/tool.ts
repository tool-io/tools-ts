import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordIds: readonly string[];
  readonly statuses: readonly string[];
};
export type Output = {
  readonly conflictingIds: readonly string[];
  readonly duplicateRows: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    statuses: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["recordIds", "statuses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conflictingIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    duplicateRows: { type: "integer" },
  },
  required: ["conflictingIds", "duplicateRows"],
} as const;
/** Audit literal administrative record statuses without determining prescription validity or dispensing authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordIds, statuses } = request;
  const compute = (): Output => {
    H.sameLength(recordIds, statuses);
    const groups = new Map<string, Set<string>>();
    recordIds.forEach((id, i) => {
      const s = groups.get(id) ?? new Set<string>();
      s.add(statuses[i]);
      groups.set(id, s);
    });
    return {
      conflictingIds: [...groups]
        .filter(([, s]) => s.size > 1)
        .map(([id]) => id),
      duplicateRows:
        recordIds.length -
        new Set(recordIds.map((x, i) => JSON.stringify([x, statuses[i]]))).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordIds: ["R1", "R1", "R2"],
    statuses: ["open", "closed", "open"],
  },
  output: { conflictingIds: ["R1"], duplicateRows: 0 },
} satisfies ToolExample<Input, Output>;
export const prescriptionRecordStatusConflictTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-pharmacy/prescription-record-status-conflict",
    title: "Prescription Record Status Conflict Tool",
    description:
      "Audit literal administrative record statuses without determining prescription validity or dispensing authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        statuses: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["recordIds", "statuses"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conflictingIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        duplicateRows: { type: "integer" },
      },
      required: ["conflictingIds", "duplicateRows"],
    },
    ports: {
      inputs: [
        {
          id: "recordIds",
          label: "Record Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "statuses",
          label: "Statuses",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "conflictingIds",
          label: "Conflicting Ids",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "duplicateRows",
          label: "Duplicate Rows",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = prescriptionRecordStatusConflictTool.execute;
export default prescriptionRecordStatusConflictTool;

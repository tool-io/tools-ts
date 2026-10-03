import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expectedIds: readonly string[];
  readonly recordedIds: readonly string[];
};
export type Output = {
  readonly completed: readonly string[];
  readonly missing: readonly string[];
  readonly duplicateIds: readonly string[];
  readonly unexpected: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    recordedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["expectedIds", "recordedIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completed: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missing: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    duplicateIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    unexpected: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["completed", "missing", "duplicateIds", "unexpected"],
} as const;
/** Reconcile expected diary bins with duplicate and unexpected entries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expectedIds, recordedIds } = request;
  const compute = (): Output => {
    H.domain(new Set(expectedIds).size === expectedIds.length, "expectedIds");
    const counts = new Map<string, number>();
    for (const id of recordedIds) counts.set(id, (counts.get(id) ?? 0) + 1);
    return {
      completed: expectedIds.filter((id) => counts.has(id)),
      missing: expectedIds.filter((id) => !counts.has(id)),
      duplicateIds: [...counts].filter(([, n]) => n > 1).map(([id]) => id),
      unexpected: [...counts.keys()].filter((id) => !expectedIds.includes(id)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expectedIds: ["am", "pm"], recordedIds: ["am", "am", "night"] },
  output: {
    completed: ["am"],
    missing: ["pm"],
    duplicateIds: ["am"],
    unexpected: ["night"],
  },
} satisfies ToolExample<Input, Output>;
export const rheumatologyDiaryTimebinCompletenessTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "rheumatology/rheumatology-diary-timebin-completeness",
      title: "Rheumatology Diary Timebin Completeness Tool",
      description:
        "Reconcile expected diary bins with duplicate and unexpected entries.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expectedIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          recordedIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["expectedIds", "recordedIds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          completed: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          missing: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          duplicateIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          unexpected: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["completed", "missing", "duplicateIds", "unexpected"],
      },
      ports: {
        inputs: [
          {
            id: "expectedIds",
            label: "Expected Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "recordedIds",
            label: "Recorded Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "completed",
            label: "Completed",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "missing",
            label: "Missing",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "duplicateIds",
            label: "Duplicate Ids",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "unexpected",
            label: "Unexpected",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = rheumatologyDiaryTimebinCompletenessTool.execute;
export default rheumatologyDiaryTimebinCompletenessTool;

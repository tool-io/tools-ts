import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expectedIds: readonly string[];
  readonly expectedVersions: readonly string[];
  readonly observedIds: readonly string[];
  readonly observedVersions: readonly string[];
};
export type Output = {
  readonly matched: readonly string[];
  readonly mismatched: readonly string[];
  readonly absent: readonly string[];
  readonly unknown: readonly string[];
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
    expectedVersions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    observedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    observedVersions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "expectedIds",
    "expectedVersions",
    "observedIds",
    "observedVersions",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matched: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    mismatched: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    absent: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    unknown: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["matched", "mismatched", "absent", "unknown"],
} as const;
/** Reconcile required form versions with observed, missing and unknown forms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expectedIds, expectedVersions, observedIds, observedVersions } =
    request;
  const compute = (): Output => {
    H.sameLength(expectedIds, expectedVersions);
    H.sameLength(observedIds, observedVersions);
    H.domain(
      new Set(expectedIds).size === expectedIds.length &&
        new Set(observedIds).size === observedIds.length,
      "observedIds",
    );
    const expected = new Map(
      expectedIds.map((id, i) => [id, expectedVersions[i]]),
    );
    return {
      matched: observedIds.filter(
        (id, i) => expected.has(id) && expected.get(id) === observedVersions[i],
      ),
      mismatched: observedIds.filter(
        (id, i) => expected.has(id) && expected.get(id) !== observedVersions[i],
      ),
      absent: expectedIds.filter((id) => !observedIds.includes(id)),
      unknown: observedIds.filter((id) => !expected.has(id)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    expectedIds: ["consent", "survey"],
    expectedVersions: ["v2", "v1"],
    observedIds: ["survey", "consent", "extra"],
    observedVersions: ["v1", "v1", "v3"],
  },
  output: {
    matched: ["survey"],
    mismatched: ["consent"],
    absent: [],
    unknown: ["extra"],
  },
} satisfies ToolExample<Input, Output>;
export const perioperativeFormsVersionConcordanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "anesthesiology/perioperative-forms-version-concordance",
      title: "Perioperative Forms Version Concordance Tool",
      description:
        "Reconcile required form versions with observed, missing and unknown forms.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expectedIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          expectedVersions: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          observedIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          observedVersions: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: [
          "expectedIds",
          "expectedVersions",
          "observedIds",
          "observedVersions",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          matched: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          mismatched: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          absent: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          unknown: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["matched", "mismatched", "absent", "unknown"],
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
            id: "expectedVersions",
            label: "Expected Versions",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "observedIds",
            label: "Observed Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "observedVersions",
            label: "Observed Versions",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "matched",
            label: "Matched",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "mismatched",
            label: "Mismatched",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "absent",
            label: "Absent",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "unknown",
            label: "Unknown",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = perioperativeFormsVersionConcordanceTool.execute;
export default perioperativeFormsVersionConcordanceTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly armIds: readonly string[];
  readonly recordedAccessible: readonly boolean[];
};
export type Output = {
  readonly accessibleArmIds: readonly string[];
  readonly inaccessibleArmIds: readonly string[];
  readonly allRecordedAccessible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    armIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    recordedAccessible: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["armIds", "recordedAccessible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accessibleArmIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    inaccessibleArmIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    allRecordedAccessible: { type: "boolean" },
  },
  required: ["accessibleArmIds", "inaccessibleArmIds", "allRecordedAccessible"],
} as const;
/** Partition explicit intersection arm identifiers by supplied accessibility flags without evaluating design compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { armIds, recordedAccessible } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(
        armIds.length === recordedAccessible.length,
        "recordedAccessible",
      );
      H.domain(new Set(armIds).size === armIds.length, "armIds");
      return {
        accessibleArmIds: armIds.filter((_, i) => recordedAccessible[i]),
        inaccessibleArmIds: armIds.filter((_, i) => !recordedAccessible[i]),
        allRecordedAccessible: recordedAccessible.every(Boolean),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { armIds: ["N", "E", "S"], recordedAccessible: [true, false, true] },
  output: {
    accessibleArmIds: ["N", "S"],
    inaccessibleArmIds: ["E"],
    allRecordedAccessible: false,
  },
} satisfies ToolExample<Input, Output>;
export const streetIntersectionAccessibleArmFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["urban-planning", "urban planning", "arts and design"],
        keywords: ["urban planning", "arts and design"],
      },
      id: "urban-planning/street-intersection-accessible-arm-flag",
      title: "Street Intersection Accessible Arm Flag",
      description:
        "Partition explicit intersection arm identifiers by supplied accessibility flags without evaluating design compliance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          armIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          recordedAccessible: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
        },
        required: ["armIds", "recordedAccessible"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          accessibleArmIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          inaccessibleArmIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          allRecordedAccessible: { type: "boolean" },
        },
        required: [
          "accessibleArmIds",
          "inaccessibleArmIds",
          "allRecordedAccessible",
        ],
      },
      ports: {
        inputs: [
          {
            id: "armIds",
            label: "Arm Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "recordedAccessible",
            label: "Recorded Accessible",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
        outputs: [
          {
            id: "accessibleArmIds",
            label: "Accessible Arm Ids",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "inaccessibleArmIds",
            label: "Inaccessible Arm Ids",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "allRecordedAccessible",
            label: "All Recorded Accessible",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = streetIntersectionAccessibleArmFlagTool.execute;
export default streetIntersectionAccessibleArmFlagTool;

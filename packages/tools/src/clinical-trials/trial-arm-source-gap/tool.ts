import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantIds: readonly string[];
  readonly assignedArms: readonly string[];
  readonly sourceArms: readonly string[];
  readonly validArms: readonly string[];
};
export type Output = {
  readonly armMismatches: number;
  readonly unknownAssignedArms: number;
  readonly supportedAssignments: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    assignedArms: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceArms: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    validArms: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["participantIds", "assignedArms", "sourceArms", "validArms"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    armMismatches: { type: "integer" },
    unknownAssignedArms: { type: "integer" },
    supportedAssignments: { type: "integer" },
  },
  required: ["armMismatches", "unknownAssignedArms", "supportedAssignments"],
} as const;
/** Compare explicit assignment provenance; no randomization, unblinding or treatment decision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantIds, assignedArms, sourceArms, validArms } = request;
  const compute = (): Output => {
    H.sameLength(participantIds, assignedArms);
    H.sameLength(participantIds, sourceArms);
    return {
      armMismatches: assignedArms.filter((x, i) => x !== sourceArms[i]).length,
      unknownAssignedArms: assignedArms.filter((x) => !validArms.includes(x))
        .length,
      supportedAssignments: participantIds.filter(
        (x, i) =>
          assignedArms[i] === sourceArms[i] &&
          validArms.includes(assignedArms[i]),
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participantIds: ["p1", "p2"],
    assignedArms: ["A", "B"],
    sourceArms: ["A", "A"],
    validArms: ["A", "B"],
  },
  output: { armMismatches: 1, unknownAssignedArms: 0, supportedAssignments: 1 },
} satisfies ToolExample<Input, Output>;
export const trialArmSourceGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "clinical-trials/trial-arm-source-gap",
    title: "Trial Arm Source Gap Tool",
    description:
      "Compare explicit assignment provenance; no randomization, unblinding or treatment decision.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        assignedArms: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceArms: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        validArms: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["participantIds", "assignedArms", "sourceArms", "validArms"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        armMismatches: { type: "integer" },
        unknownAssignedArms: { type: "integer" },
        supportedAssignments: { type: "integer" },
      },
      required: [
        "armMismatches",
        "unknownAssignedArms",
        "supportedAssignments",
      ],
    },
    ports: {
      inputs: [
        {
          id: "participantIds",
          label: "Participant Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "assignedArms",
          label: "Assigned Arms",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceArms",
          label: "Source Arms",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "validArms",
          label: "Valid Arms",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "armMismatches",
          label: "Arm Mismatches",
          valueType: { type: "integer" },
        },
        {
          id: "unknownAssignedArms",
          label: "Unknown Assigned Arms",
          valueType: { type: "integer" },
        },
        {
          id: "supportedAssignments",
          label: "Supported Assignments",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialArmSourceGapTool.execute;
export default trialArmSourceGapTool;

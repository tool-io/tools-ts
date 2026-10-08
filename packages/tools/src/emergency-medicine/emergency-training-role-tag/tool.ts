import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exerciseCode: string;
  readonly participantCode: string;
  readonly assignedRole: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exerciseCode: { type: "string", maxLength: 8192, minLength: 1 },
    participantCode: { type: "string", maxLength: 8192, minLength: 1 },
    assignedRole: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["exerciseCode", "participantCode", "assignedRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label an explicitly assigned emergency-training role without determining real-world qualifications. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exerciseCode, participantCode, assignedRole } = request;
  const compute = (): Output => {
    H.domain(
      exerciseCode.length > 0 &&
        participantCode.length > 0 &&
        assignedRole.length > 0,
      "exerciseCode",
    );
    return {
      tag: JSON.stringify([exerciseCode, participantCode, assignedRole]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    exerciseCode: "EX17",
    participantCode: "P3",
    assignedRole: "observer",
  },
  output: { tag: '["EX17","P3","observer"]' },
} satisfies ToolExample<Input, Output>;
export const emergencyTrainingRoleTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "emergency-medicine",
        "emergency medicine",
        "health and medicine",
      ],
      keywords: ["emergency medicine", "health and medicine"],
    },
    id: "emergency-medicine/emergency-training-role-tag",
    title: "Emergency Training Role Tag",
    description:
      "Label an explicitly assigned emergency-training role without determining real-world qualifications.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exerciseCode: { type: "string", maxLength: 8192, minLength: 1 },
        participantCode: { type: "string", maxLength: 8192, minLength: 1 },
        assignedRole: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["exerciseCode", "participantCode", "assignedRole"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "exerciseCode",
          label: "Exercise Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "participantCode",
          label: "Participant Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assignedRole",
          label: "Assigned Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = emergencyTrainingRoleTagTool.execute;
export default emergencyTrainingRoleTagTool;

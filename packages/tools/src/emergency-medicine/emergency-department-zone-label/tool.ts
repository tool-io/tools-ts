import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly encounterCode: string;
  readonly assignedZone: string;
  readonly assignmentSource: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    encounterCode: { type: "string", maxLength: 8192, minLength: 1 },
    assignedZone: { type: "string", maxLength: 8192, minLength: 1 },
    assignmentSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["encounterCode", "assignedZone", "assignmentSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded department-zone assignment without directing a patient or assigning acuity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { encounterCode, assignedZone, assignmentSource } = request;
  const compute = (): Output => {
    H.domain(
      encounterCode.length > 0 &&
        assignedZone.length > 0 &&
        assignmentSource.length > 0,
      "encounterCode",
    );
    return {
      label:
        encounterCode +
        "; zone=" +
        assignedZone +
        " [" +
        assignmentSource +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    encounterCode: "E17",
    assignedZone: "zone B",
    assignmentSource: "recorded allocation",
  },
  output: { label: "E17; zone=zone B [recorded allocation]" },
} satisfies ToolExample<Input, Output>;
export const emergencyDepartmentZoneLabelTool = H.defineSchemaCalculation<
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
    id: "emergency-medicine/emergency-department-zone-label",
    title: "Emergency Department Zone Label",
    description:
      "Label an explicitly recorded department-zone assignment without directing a patient or assigning acuity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        encounterCode: { type: "string", maxLength: 8192, minLength: 1 },
        assignedZone: { type: "string", maxLength: 8192, minLength: 1 },
        assignmentSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["encounterCode", "assignedZone", "assignmentSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "encounterCode",
          label: "Encounter Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assignedZone",
          label: "Assigned Zone",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assignmentSource",
          label: "Assignment Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = emergencyDepartmentZoneLabelTool.execute;
export default emergencyDepartmentZoneLabelTool;

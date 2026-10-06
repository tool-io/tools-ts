import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly substituteAssigned: boolean;
  readonly substituteAcknowledged: boolean;
};
export type Output = { readonly acknowledgmentPending: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    substituteAssigned: { type: "boolean" },
    substituteAcknowledged: { type: "boolean" },
  },
  required: ["substituteAssigned", "substituteAcknowledged"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { acknowledgmentPending: { type: "boolean" } },
  required: ["acknowledgmentPending"],
} as const;
/** Flag an explicitly assigned responsibility substitute whose acknowledgment is absent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { substituteAssigned, substituteAcknowledged } = request;
  const compute = (): Output => {
    return {
      acknowledgmentPending: substituteAssigned && !substituteAcknowledged,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { substituteAssigned: true, substituteAcknowledged: false },
  output: { acknowledgmentPending: true },
} satisfies ToolExample<Input, Output>;
export const responsibilitySubstituteAcknowledgmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["applied-ethics", "applied ethics", "philosophy"],
        keywords: ["applied ethics", "philosophy"],
      },
      id: "applied-ethics/responsibility-substitute-acknowledgment",
      title: "Responsibility Substitute Acknowledgment",
      description:
        "Flag an explicitly assigned responsibility substitute whose acknowledgment is absent.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          substituteAssigned: { type: "boolean" },
          substituteAcknowledged: { type: "boolean" },
        },
        required: ["substituteAssigned", "substituteAcknowledged"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { acknowledgmentPending: { type: "boolean" } },
        required: ["acknowledgmentPending"],
      },
      ports: {
        inputs: [
          {
            id: "substituteAssigned",
            label: "Substitute Assigned",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "substituteAcknowledged",
            label: "Substitute Acknowledged",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "acknowledgmentPending",
            label: "Acknowledgment Pending",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = responsibilitySubstituteAcknowledgmentTool.execute;
export default responsibilitySubstituteAcknowledgmentTool;

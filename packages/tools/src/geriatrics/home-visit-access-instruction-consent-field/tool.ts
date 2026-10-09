import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly instructionText: string;
  readonly permissionToShare: boolean;
  readonly replacementText: string;
};
export type Output = { readonly sharedInstruction: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    instructionText: { type: "string", maxLength: 8192 },
    permissionToShare: { type: "boolean" },
    replacementText: { type: "string", maxLength: 8192 },
  },
  required: ["instructionText", "permissionToShare", "replacementText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sharedInstruction: { type: "string", maxLength: 8192 } },
  required: ["sharedInstruction"],
} as const;
/** Choose supplied home-visit access instructions or replacement under an explicit sharing flag without granting access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { instructionText, permissionToShare, replacementText } = request;
  const compute = (): Output => {
    return {
      sharedInstruction: permissionToShare ? instructionText : replacementText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    instructionText: "Use side entrance",
    permissionToShare: false,
    replacementText: "withheld",
  },
  output: { sharedInstruction: "withheld" },
} satisfies ToolExample<Input, Output>;
export const homeVisitAccessInstructionConsentFieldTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geriatrics/home-visit-access-instruction-consent-field",
      title: "Home Visit Access Instruction Consent Field Tool",
      description:
        "Choose supplied home-visit access instructions or replacement under an explicit sharing flag without granting access.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          instructionText: { type: "string", maxLength: 8192 },
          permissionToShare: { type: "boolean" },
          replacementText: { type: "string", maxLength: 8192 },
        },
        required: ["instructionText", "permissionToShare", "replacementText"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { sharedInstruction: { type: "string", maxLength: 8192 } },
        required: ["sharedInstruction"],
      },
      ports: {
        inputs: [
          {
            id: "instructionText",
            label: "Instruction Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "permissionToShare",
            label: "Permission To Share",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "replacementText",
            label: "Replacement Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "sharedInstruction",
            label: "Shared Instruction",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = homeVisitAccessInstructionConsentFieldTool.execute;
export default homeVisitAccessInstructionConsentFieldTool;

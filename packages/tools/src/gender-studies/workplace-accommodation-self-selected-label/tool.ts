import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly selfSelectedWording: string;
  readonly preferenceSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    selfSelectedWording: { type: "string", maxLength: 8192, minLength: 1 },
    preferenceSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "selfSelectedWording", "preferenceSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly self-selected workplace accommodation label without assigning needs or deciding eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, selfSelectedWording, preferenceSource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(selfSelectedWording.length > 0, "selfSelectedWording");
    H.domain(preferenceSource.length > 0, "preferenceSource");
    return {
      token: JSON.stringify([recordId, selfSelectedWording, preferenceSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    selfSelectedWording: "Option A",
    preferenceSource: "Participant form",
  },
  output: { token: '["R17","Option A","Participant form"]' },
} satisfies ToolExample<Input, Output>;
export const workplaceAccommodationSelfSelectedLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["gender-studies", "gender studies", "social sciences"],
        keywords: ["gender studies", "social sciences"],
      },
      id: "gender-studies/workplace-accommodation-self-selected-label",
      title: "Workplace Accommodation Self Selected Label",
      description:
        "Preserve an explicitly self-selected workplace accommodation label without assigning needs or deciding eligibility.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          selfSelectedWording: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          preferenceSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "selfSelectedWording", "preferenceSource"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "selfSelectedWording",
            label: "Self Selected Wording",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "preferenceSource",
            label: "Preference Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = workplaceAccommodationSelfSelectedLabelTool.execute;
export default workplaceAccommodationSelfSelectedLabelTool;

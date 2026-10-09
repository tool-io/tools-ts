import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly grammaticalSlot: string;
  readonly suppliedForm: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    grammaticalSlot: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedForm: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "grammaticalSlot", "suppliedForm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly supplied pronoun form and grammatical slot without inferring a person preferred pronouns. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, grammaticalSlot, suppliedForm } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(grammaticalSlot.length > 0, "grammaticalSlot");
    H.domain(suppliedForm.length > 0, "suppliedForm");
    return { token: JSON.stringify([recordId, grammaticalSlot, suppliedForm]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", grammaticalSlot: "subject", suppliedForm: "they" },
  output: { token: '["R17","subject","they"]' },
} satisfies ToolExample<Input, Output>;
export const pronounSetSingleFormSlotTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["gender-studies", "gender studies", "social sciences"],
      keywords: ["gender studies", "social sciences"],
    },
    id: "gender-studies/pronoun-set-single-form-slot",
    title: "Pronoun Set Single Form Slot",
    description:
      "Preserve an explicitly supplied pronoun form and grammatical slot without inferring a person preferred pronouns.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        grammaticalSlot: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedForm: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "grammaticalSlot", "suppliedForm"],
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
          id: "grammaticalSlot",
          label: "Grammatical Slot",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedForm",
          label: "Supplied Form",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pronounSetSingleFormSlotTool.execute;
export default pronounSetSingleFormSlotTool;

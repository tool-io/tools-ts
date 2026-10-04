import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pseudonym: string;
  readonly utteranceNumber: number;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pseudonym: { type: "string", maxLength: 8192 },
    utteranceNumber: { type: "integer", minimum: 1 },
  },
  required: ["pseudonym", "utteranceNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Create an unambiguous speaker-pseudonym and utterance token without using a real identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pseudonym, utteranceNumber } = request;
  const compute = (): Output => {
    H.domain(pseudonym.trim().length > 0, "pseudonym");
    (H.domain(
      Number.isSafeInteger(utteranceNumber) &&
        utteranceNumber >= 1 &&
        utteranceNumber <= Number.MAX_SAFE_INTEGER,
      "utteranceNumber",
    ),
      utteranceNumber);
    return { token: JSON.stringify(pseudonym) + "#" + utteranceNumber };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pseudonym: "River", utteranceNumber: 12 },
  output: { token: '"River"#12' },
} satisfies ToolExample<Input, Output>;
export const fieldNoteSpeakerPseudonymTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/field-note-speaker-pseudonym-token",
    title: "Field Note Speaker Pseudonym Token Tool",
    description:
      "Create an unambiguous speaker-pseudonym and utterance token without using a real identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pseudonym: { type: "string", maxLength: 8192 },
        utteranceNumber: { type: "integer", minimum: 1 },
      },
      required: ["pseudonym", "utteranceNumber"],
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
          id: "pseudonym",
          label: "Pseudonym",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "utteranceNumber",
          label: "Utterance Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fieldNoteSpeakerPseudonymTokenTool.execute;
export default fieldNoteSpeakerPseudonymTokenTool;

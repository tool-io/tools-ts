import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly character: string;
  readonly fieldSeparator: string;
  readonly encodingCharacters: string;
};
export type Output = { readonly role: string; readonly recognized: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    character: { type: "string", maxLength: 1, minLength: 1 },
    fieldSeparator: { type: "string", maxLength: 1, minLength: 1 },
    encodingCharacters: { type: "string", maxLength: 5, minLength: 4 },
  },
  required: ["character", "fieldSeparator", "encodingCharacters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    role: { type: "string", maxLength: 8192 },
    recognized: { type: "boolean" },
  },
  required: ["role", "recognized"],
} as const;
/** Classify a supplied HL7 v2 delimiter under explicit four- or five-character MSH encoding metadata, including optional truncation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { character, fieldSeparator, encodingCharacters } = request;
  const compute = (): Output => {
    H.domain(character.length === 1, "character");
    H.domain(
      fieldSeparator.length === 1 &&
        (encodingCharacters.length === 4 || encodingCharacters.length === 5) &&
        /^[!-~]+(?![\s\S])/.test(fieldSeparator + encodingCharacters) &&
        new Set(fieldSeparator + encodingCharacters).size ===
          encodingCharacters.length + 1,
      "encodingCharacters",
    );
    const chars = fieldSeparator + encodingCharacters,
      roles = [
        "field",
        "component",
        "repetition",
        "escape",
        "subcomponent",
        "truncation",
      ],
      i = chars.indexOf(character);
    return { role: i < 0 ? "unmapped" : roles[i], recognized: i >= 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { character: "^", fieldSeparator: "|", encodingCharacters: "^~\\&" },
  output: { role: "component", recognized: true },
} satisfies ToolExample<Input, Output>;
export const hl7DelimiterRoleLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/hl7-delimiter-role-label",
    title: "HL7 Delimiter Role Label Tool",
    description:
      "Classify a supplied HL7 v2 delimiter under explicit four- or five-character MSH encoding metadata, including optional truncation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        character: { type: "string", maxLength: 1, minLength: 1 },
        fieldSeparator: { type: "string", maxLength: 1, minLength: 1 },
        encodingCharacters: { type: "string", maxLength: 5, minLength: 4 },
      },
      required: ["character", "fieldSeparator", "encodingCharacters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        role: { type: "string", maxLength: 8192 },
        recognized: { type: "boolean" },
      },
      required: ["role", "recognized"],
    },
    ports: {
      inputs: [
        {
          id: "character",
          label: "Character",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fieldSeparator",
          label: "Field Separator",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "encodingCharacters",
          label: "Encoding Characters",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "role", label: "Role", valueType: { type: "string" } },
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = hl7DelimiterRoleLabelTool.execute;
export default hl7DelimiterRoleLabelTool;

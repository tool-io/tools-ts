import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly encoded: string; readonly separator: string };
export type Output = {
  readonly family: string;
  readonly given: string;
  readonly additional: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    encoded: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["encoded", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    family: { type: "string", maxLength: 8192 },
    given: { type: "string", maxLength: 8192 },
    additional: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["family", "given", "additional"],
} as const;
/** Split explicit HL7 name components without decoding delimiter escapes or choosing a culturally universal display order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { encoded, separator } = request;
  const compute = (): Output => {
    H.domain(separator.length === 1);
    const parts = encoded.split(separator);
    H.domain(parts.length >= 2);
    return { family: parts[0], given: parts[1], additional: parts.slice(2) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { encoded: "Smith^Alex^J", separator: "^" },
  output: { family: "Smith", given: "Alex", additional: ["J"] },
} satisfies ToolExample<Input, Output>;
export const hl7PersonNameFamilyGivenComponentTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-informatics/hl7-person-name-family-given-component-token",
      title: "HL7 Person Name Family Given Component Token Tool",
      description:
        "Split explicit HL7 name components without decoding delimiter escapes or choosing a culturally universal display order.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          encoded: { type: "string", maxLength: 8192 },
          separator: { type: "string", maxLength: 8192 },
        },
        required: ["encoded", "separator"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          family: { type: "string", maxLength: 8192 },
          given: { type: "string", maxLength: 8192 },
          additional: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["family", "given", "additional"],
      },
      ports: {
        inputs: [
          {
            id: "encoded",
            label: "Encoded",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "separator",
            label: "Separator",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "family", label: "Family", valueType: { type: "string" } },
          { id: "given", label: "Given", valueType: { type: "string" } },
          {
            id: "additional",
            label: "Additional",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = hl7PersonNameFamilyGivenComponentTokenTool.execute;
export default hl7PersonNameFamilyGivenComponentTokenTool;

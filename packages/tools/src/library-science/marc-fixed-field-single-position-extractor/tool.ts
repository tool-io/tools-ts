import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly field: string; readonly position: number };
export type Output = { readonly character: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    field: { type: "string", maxLength: 8192 },
    position: { type: "integer", minimum: 0 },
  },
  required: ["field", "position"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { character: { type: "string", maxLength: 8192 } },
  required: ["character"],
} as const;
/** Extract one zero-based printable ASCII fixed-field position without inferring a MARC tag or cataloging code. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { field, position } = request;
  const compute = (): Output => {
    H.integer(position, 0, field.length - 1);
    H.domain(/^[\x20-\x7e]*(?![\s\S])/.test(field));
    return { character: field[position] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { field: "260101s2026", position: 6 },
  output: { character: "s" },
} satisfies ToolExample<Input, Output>;
export const marcFixedFieldSinglePositionExtractorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "library-science/marc-fixed-field-single-position-extractor",
      title: "MARC Fixed Field Single Position Extractor Tool",
      description:
        "Extract one zero-based printable ASCII fixed-field position without inferring a MARC tag or cataloging code.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          field: { type: "string", maxLength: 8192 },
          position: { type: "integer", minimum: 0 },
        },
        required: ["field", "position"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { character: { type: "string", maxLength: 8192 } },
        required: ["character"],
      },
      ports: {
        inputs: [
          {
            id: "field",
            label: "Field",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "position",
            label: "Position",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "character",
            label: "Character",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = marcFixedFieldSinglePositionExtractorTool.execute;
export default marcFixedFieldSinglePositionExtractorTool;

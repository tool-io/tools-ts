import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly text: string;
  readonly maximumCodeUnits: number;
  readonly reservedCodeUnits: number;
};
export type Output = {
  readonly used: number;
  readonly remaining: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    maximumCodeUnits: { type: "integer", minimum: 0 },
    reservedCodeUnits: { type: "integer", minimum: 0 },
  },
  required: ["text", "maximumCodeUnits", "reservedCodeUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    used: { type: "integer" },
    remaining: { type: "integer" },
    fits: { type: "boolean" },
  },
  required: ["used", "remaining", "fits"],
} as const;
/** Budget supplied public signage text in explicitly counted UTF-16 code units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { text, maximumCodeUnits, reservedCodeUnits } = request;
  const compute = (): Output => {
    H.integer(maximumCodeUnits, 0);
    H.integer(reservedCodeUnits, 0, maximumCodeUnits);
    return {
      used: text.length,
      remaining: maximumCodeUnits - reservedCodeUnits - text.length,
      fits: text.length + reservedCodeUnits <= maximumCodeUnits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { text: "Wash hands", maximumCodeUnits: 14, reservedCodeUnits: 2 },
  output: { used: 10, remaining: 2, fits: true },
} satisfies ToolExample<Input, Output>;
export const biosafetyPublicSignageCharacterBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosafety/biosafety-public-signage-character-budget",
      title: "Biosafety Public Signage Character Budget Tool",
      description:
        "Budget supplied public signage text in explicitly counted UTF-16 code units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: { type: "string", maxLength: 8192 },
          maximumCodeUnits: { type: "integer", minimum: 0 },
          reservedCodeUnits: { type: "integer", minimum: 0 },
        },
        required: ["text", "maximumCodeUnits", "reservedCodeUnits"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          used: { type: "integer" },
          remaining: { type: "integer" },
          fits: { type: "boolean" },
        },
        required: ["used", "remaining", "fits"],
      },
      ports: {
        inputs: [
          {
            id: "text",
            label: "Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "maximumCodeUnits",
            label: "Maximum Code Units",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reservedCodeUnits",
            label: "Reserved Code Units",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "used", label: "Used", valueType: { type: "integer" } },
          {
            id: "remaining",
            label: "Remaining",
            valueType: { type: "integer" },
          },
          { id: "fits", label: "Fits", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = biosafetyPublicSignageCharacterBudgetTool.execute;
export default biosafetyPublicSignageCharacterBudgetTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly character: string; readonly position: number };
export type Output = { readonly allowed: boolean; readonly forbidden: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    character: { type: "string", maxLength: 8192 },
    position: { type: "integer", minimum: 1, maximum: 17 },
  },
  required: ["character", "position"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { allowed: { type: "boolean" }, forbidden: { type: "boolean" } },
  required: ["allowed", "forbidden"],
} as const;
/** Calculate vin forbidden letter single position flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { character, position } = request;
  const compute = (): Output => {
    H.integer(position, 1, 17);
    const forbidden = /^[IOQ](?![\s\S])/.test(character);
    return { allowed: /^[A-HJ-NPR-Z0-9](?![\s\S])/.test(character), forbidden };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { character: "I", position: 5 },
  output: { allowed: false, forbidden: true },
} satisfies ToolExample<Input, Output>;
export const vinForbiddenLetterSinglePositionFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "validate/vin-forbidden-letter-single-position-flag",
      title: "Vin Forbidden Letter Single Position Flag Tool",
      description:
        "Calculate vin forbidden letter single position flag from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          character: { type: "string", maxLength: 8192 },
          position: { type: "integer", minimum: 1, maximum: 17 },
        },
        required: ["character", "position"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          allowed: { type: "boolean" },
          forbidden: { type: "boolean" },
        },
        required: ["allowed", "forbidden"],
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
            id: "position",
            label: "Position",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "allowed", label: "Allowed", valueType: { type: "boolean" } },
          {
            id: "forbidden",
            label: "Forbidden",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = vinForbiddenLetterSinglePositionFlagTool.execute;
export default vinForbiddenLetterSinglePositionFlagTool;

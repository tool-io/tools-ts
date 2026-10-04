import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly lei: string };
export type Output = { readonly reserved: string; readonly valid: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lei: { type: "string", maxLength: 8192 } },
  required: ["lei"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reserved: { type: "string", maxLength: 8192 },
    valid: { type: "boolean" },
  },
  required: ["reserved", "valid"],
} as const;
/** Compute lei reserved position zero check from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { lei } = input;
  const compute = (): Output => {
    domain(/^[A-Z0-9]{18}\d{2}(?![\s\S])/.test(lei));
    const reserved = lei.slice(4, 6);
    return { reserved, valid: reserved === "00" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lei: "5493001KJTIIGC8Y1R12" },
  output: { reserved: "00", valid: true },
} satisfies ToolExample<Input, Output>;
export const leiReservedPositionZeroCheckTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "validate/lei-reserved-position-zero-check",
  title: "LEI Reserved Position Zero Check Tool",
  description:
    "Compute lei reserved position zero check from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "lei",
        label: "Lei",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "reserved", label: "Reserved", valueType: { type: "string" } },
      { id: "valid", label: "Valid", valueType: { type: "boolean" } },
    ],
  },
});
export const run = leiReservedPositionZeroCheckTool.execute;
export default leiReservedPositionZeroCheckTool;

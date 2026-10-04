import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly decimalToken: string };
export type Output = { readonly safeInteger: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { decimalToken: { type: "string", maxLength: 8192 } },
  required: ["decimalToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { safeInteger: { type: "boolean" } },
  required: ["safeInteger"],
} as const;
/** Calculate integer boundary representability from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { decimalToken } = request;
  const compute = (): Output => {
    return {
      safeInteger: (() => {
        const n = H.decimal(decimalToken);
        return (
          n >= BigInt(Number.MIN_SAFE_INTEGER) &&
          n <= BigInt(Number.MAX_SAFE_INTEGER)
        );
      })(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { decimalToken: "9007199254740992" },
  output: { safeInteger: false },
} satisfies ToolExample<Input, Output>;
export const integerBoundaryRepresentabilityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/integer-boundary-representability",
    title: "Integer Boundary Representability Tool",
    description:
      "Calculate integer boundary representability from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { decimalToken: { type: "string", maxLength: 8192 } },
      required: ["decimalToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { safeInteger: { type: "boolean" } },
      required: ["safeInteger"],
    },
    ports: {
      inputs: [
        {
          id: "decimalToken",
          label: "Decimal Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "safeInteger",
          label: "Safe Integer",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = integerBoundaryRepresentabilityTool.execute;
export default integerBoundaryRepresentabilityTool;

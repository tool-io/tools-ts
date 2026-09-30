import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly lexeme: string };
export type Output = { readonly finite: boolean; readonly json: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lexeme: { type: "string", maxLength: 8192 } },
  required: ["lexeme"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finite: { type: "boolean" },
    json: { type: "string", maxLength: 8192 },
  },
  required: ["finite", "json"],
} as const;
/** Compute json scalar nonfinite serialization guard from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { lexeme } = input;
  const compute = (): Output => {
    domain(
      /^[+-]?(?:Infinity|NaN|(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)(?![\s\S])/.test(
        lexeme,
      ),
    );
    const n = Number(lexeme),
      finite = Number.isFinite(n);
    return { finite, json: finite ? JSON.stringify(n) : "" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lexeme: "1e309" },
  output: { finite: false, json: "" },
} satisfies ToolExample<Input, Output>;
export const jsonScalarNonfiniteSerializationGuardTool =
  defineSchemaCalculation<Input, Output>({
    id: "json/json-scalar-nonfinite-serialization-guard",
    title: "JSON Scalar Nonfinite Serialization Guard Tool",
    description:
      "Compute json scalar nonfinite serialization guard from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "lexeme",
          label: "Lexeme",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "finite", label: "Finite", valueType: { type: "boolean" } },
        { id: "json", label: "Json", valueType: { type: "string" } },
      ],
    },
  });
export const run = jsonScalarNonfiniteSerializationGuardTool.execute;
export default jsonScalarNonfiniteSerializationGuardTool;

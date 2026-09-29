import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly mass: number };
export type Output = { readonly slope: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mass: { type: "number" } },
  required: ["mass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slope: { type: "number" } },
  required: ["slope"],
} as const;
/** Compute binary entropy local slope from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { mass } = input;
  const compute = (): Output => {
    domain(mass > 0 && mass < 1);
    return { slope: Math.log2((1 - mass) / mass) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { mass: 0.5 },
  output: { slope: 0 },
} satisfies ToolExample<Input, Output>;
export const binaryEntropyLocalSlopeTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "information/binary-entropy-local-slope",
  title: "Binary Entropy Local Slope Tool",
  description:
    "Compute binary entropy local slope from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "mass",
        label: "Mass",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [{ id: "slope", label: "Slope", valueType: { type: "number" } }],
  },
});
export const run = binaryEntropyLocalSlopeTool.execute;
export default binaryEntropyLocalSlopeTool;

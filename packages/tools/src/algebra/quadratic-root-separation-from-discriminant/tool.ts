import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly discriminant: number; readonly leading: number };
export type Output = { readonly separation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { discriminant: { type: "number" }, leading: { type: "number" } },
  required: ["discriminant", "leading"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { separation: { type: "number" } },
  required: ["separation"],
} as const;
/** Compute quadratic root separation from discriminant from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { discriminant, leading } = input;
  const compute = (): Output => {
    domain(discriminant >= 0 && leading !== 0);
    return { separation: Math.sqrt(discriminant) / Math.abs(leading) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { discriminant: 9, leading: 2 },
  output: { separation: 1.5 },
} satisfies ToolExample<Input, Output>;
export const quadraticRootSeparationFromDiscriminantTool =
  defineSchemaCalculation<Input, Output>({
    id: "algebra/quadratic-root-separation-from-discriminant",
    title: "Quadratic Root Separation From Discriminant Tool",
    description:
      "Compute quadratic root separation from discriminant from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "discriminant",
          label: "Discriminant",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leading",
          label: "Leading",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "separation",
          label: "Separation",
          valueType: { type: "number" },
        },
      ],
    },
  });
export const run = quadraticRootSeparationFromDiscriminantTool.execute;
export default quadraticRootSeparationFromDiscriminantTool;

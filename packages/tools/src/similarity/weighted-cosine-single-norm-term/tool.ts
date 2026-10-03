import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly coordinate: number; readonly weight: number };
export type Output = { readonly squaredNormTerm: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coordinate: { type: "number" }, weight: { type: "number" } },
  required: ["coordinate", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { squaredNormTerm: { type: "number" } },
  required: ["squaredNormTerm"],
} as const;
/** Compute weighted cosine single norm term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { coordinate, weight } = input;
  const compute = (): Output => {
    domain(weight >= 0);
    return { squaredNormTerm: weight * coordinate * coordinate };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { coordinate: -3, weight: 2 },
  output: { squaredNormTerm: 18 },
} satisfies ToolExample<Input, Output>;
export const weightedCosineSingleNormTermTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "similarity/weighted-cosine-single-norm-term",
  title: "Weighted Cosine Single Norm Term Tool",
  description:
    "Compute weighted cosine single norm term from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "coordinate",
        label: "Coordinate",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "weight",
        label: "Weight",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "squaredNormTerm",
        label: "Squared Norm Term",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = weightedCosineSingleNormTermTool.execute;
export default weightedCosineSingleNormTermTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly coefficient: number; readonly step: number };
export type Output = { readonly secondDifference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coefficient: { type: "number" }, step: { type: "number" } },
  required: ["coefficient", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { secondDifference: { type: "number" } },
  required: ["secondDifference"],
} as const;
/** Calculate second difference one quadratic term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coefficient, step } = request;
  const compute = (): Output => {
    return { secondDifference: 2 * coefficient * step * step };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coefficient: 3, step: 2 },
  output: { secondDifference: 24 },
} satisfies ToolExample<Input, Output>;
export const secondDifferenceOneQuadraticTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/second-difference-one-quadratic-term",
    title: "Second Difference One Quadratic Term Tool",
    description:
      "Calculate second difference one quadratic term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { coefficient: { type: "number" }, step: { type: "number" } },
      required: ["coefficient", "step"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { secondDifference: { type: "number" } },
      required: ["secondDifference"],
    },
    ports: {
      inputs: [
        {
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "secondDifference",
          label: "Second Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = secondDifferenceOneQuadraticTermTool.execute;
export default secondDifferenceOneQuadraticTermTool;

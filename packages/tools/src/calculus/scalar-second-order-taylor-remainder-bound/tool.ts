import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly thirdDerivativeBound: number;
  readonly displacement: number;
};
export type Output = { readonly bound: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    thirdDerivativeBound: { type: "number" },
    displacement: { type: "number" },
  },
  required: ["thirdDerivativeBound", "displacement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bound: { type: "number" } },
  required: ["bound"],
} as const;
/** Compute scalar second order taylor remainder bound from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { thirdDerivativeBound, displacement } = input;
  const compute = (): Output => {
    domain(thirdDerivativeBound >= 0);
    return { bound: (thirdDerivativeBound * Math.abs(displacement) ** 3) / 6 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { thirdDerivativeBound: 3, displacement: 2 },
  output: { bound: 4 },
} satisfies ToolExample<Input, Output>;
export const scalarSecondOrderTaylorRemainderBoundTool =
  defineSchemaCalculation<Input, Output>({
    id: "calculus/scalar-second-order-taylor-remainder-bound",
    title: "Scalar Second Order Taylor Remainder Bound Tool",
    description:
      "Compute scalar second order taylor remainder bound from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "thirdDerivativeBound",
          label: "Third Derivative Bound",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "displacement",
          label: "Displacement",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "bound", label: "Bound", valueType: { type: "number" } }],
    },
  });
export const run = scalarSecondOrderTaylorRemainderBoundTool.execute;
export default scalarSecondOrderTaylorRemainderBoundTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly forwardDerivative: number };
export type Output = { readonly inverseDerivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { forwardDerivative: { type: "number" } },
  required: ["forwardDerivative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inverseDerivative: { type: "number" } },
  required: ["inverseDerivative"],
} as const;
/** Return the inverse function derivative at the corresponding image point from a supplied nonzero forward derivative. Local invertibility is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forwardDerivative } = request;
  const compute = (): Output => {
    H.domain(forwardDerivative !== 0, "forwardDerivative");
    return { inverseDerivative: 1 / forwardDerivative };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { forwardDerivative: 4 },
  output: { inverseDerivative: 0.25 },
} satisfies ToolExample<Input, Output>;
export const inverseFunctionLocalDerivativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/inverse-function-local-derivative",
    title: "Inverse Function Local Derivative Tool",
    description:
      "Return the inverse function derivative at the corresponding image point from a supplied nonzero forward derivative. Local invertibility is assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { forwardDerivative: { type: "number" } },
      required: ["forwardDerivative"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { inverseDerivative: { type: "number" } },
      required: ["inverseDerivative"],
    },
    ports: {
      inputs: [
        {
          id: "forwardDerivative",
          label: "Forward Derivative",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "inverseDerivative",
          label: "Inverse Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = inverseFunctionLocalDerivativeTool.execute;
export default inverseFunctionLocalDerivativeTool;

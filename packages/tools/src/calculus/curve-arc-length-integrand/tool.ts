import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly derivatives: readonly number[] };
export type Output = { readonly integrand: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    derivatives: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["derivatives"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { integrand: { type: "number" } },
  required: ["integrand"],
} as const;
/** Calculate curve arc length integrand from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { derivatives } = input;
  const compute = (): Output => {
    H.domain(derivatives.length > 0);
    return { integrand: Math.hypot(...derivatives) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { derivatives: [3, 4] },
  output: { integrand: 5 },
} satisfies ToolExample<Input, Output>;
export const curveArcLengthIntegrandTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/curve-arc-length-integrand",
    title: "Curve Arc Length Integrand Tool",
    description:
      "Calculate curve arc length integrand from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        derivatives: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["derivatives"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { integrand: { type: "number" } },
      required: ["integrand"],
    },
    ports: {
      inputs: [
        {
          id: "derivatives",
          label: "Derivatives",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "integrand", label: "Integrand", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = curveArcLengthIntegrandTool.execute;
export default curveArcLengthIntegrandTool;

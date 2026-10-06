import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly realRoot: number };
export type Output = { readonly reciprocalRoot: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { realRoot: { type: "number" } },
  required: ["realRoot"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reciprocalRoot: { type: "number" } },
  required: ["reciprocalRoot"],
} as const;
/** Map an explicit nonzero real root to its reciprocal for polynomial coefficient reversal, without solving a polynomial. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { realRoot } = request;
  const compute = (): Output => {
    H.domain(realRoot !== 0, "realRoot");
    return { reciprocalRoot: 1 / realRoot };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { realRoot: 4 },
  output: { reciprocalRoot: 0.25 },
} satisfies ToolExample<Input, Output>;
export const polynomialRootReciprocalMapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["algebra", "mathematics"],
      keywords: ["algebra", "mathematics"],
    },
    id: "algebra/polynomial-root-reciprocal-map",
    title: "Polynomial Root Reciprocal Map",
    description:
      "Map an explicit nonzero real root to its reciprocal for polynomial coefficient reversal, without solving a polynomial.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { realRoot: { type: "number" } },
      required: ["realRoot"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reciprocalRoot: { type: "number" } },
      required: ["reciprocalRoot"],
    },
    ports: {
      inputs: [
        {
          id: "realRoot",
          label: "Real Root",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reciprocalRoot",
          label: "Reciprocal Root",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = polynomialRootReciprocalMapTool.execute;
export default polynomialRootReciprocalMapTool;

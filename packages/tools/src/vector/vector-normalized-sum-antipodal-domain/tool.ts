import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly number[];
  readonly second: readonly number[];
  readonly tolerance: number;
};
export type Output = { readonly defined: boolean; readonly sumNorm: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    second: { type: "array", maxItems: 256, items: { type: "number" } },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["first", "second", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { defined: { type: "boolean" }, sumNorm: { type: "number" } },
  required: ["defined", "sumNorm"],
} as const;
/** Calculate vector normalized sum antipodal domain from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, tolerance } = request;
  const compute = (): Output => {
    H.sameLength(first, second);
    H.domain(
      tolerance >= 0 &&
        Math.abs(Math.hypot(...first) - 1) <= 1e-12 &&
        Math.abs(Math.hypot(...second) - 1) <= 1e-12,
    );
    const sumNorm = Math.hypot(...first.map((x, i) => x + second[i]));
    return { defined: sumNorm > tolerance, sumNorm };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: [1, 0], second: [-1, 0], tolerance: 0 },
  output: { defined: false, sumNorm: 0 },
} satisfies ToolExample<Input, Output>;
export const vectorNormalizedSumAntipodalDomainTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-normalized-sum-antipodal-domain",
    title: "Vector Normalized Sum Antipodal Domain Tool",
    description:
      "Calculate vector normalized sum antipodal domain from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "array", maxItems: 256, items: { type: "number" } },
        second: { type: "array", maxItems: 256, items: { type: "number" } },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["first", "second", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { defined: { type: "boolean" }, sumNorm: { type: "number" } },
      required: ["defined", "sumNorm"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        { id: "sumNorm", label: "Sum Norm", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = vectorNormalizedSumAntipodalDomainTool.execute;
export default vectorNormalizedSumAntipodalDomainTool;

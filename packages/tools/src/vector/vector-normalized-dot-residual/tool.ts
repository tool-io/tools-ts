import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly number[];
  readonly second: readonly number[];
  readonly suppliedCosine: number;
};
export type Output = { readonly cosine: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    second: { type: "array", maxItems: 256, items: { type: "number" } },
    suppliedCosine: { type: "number", minimum: -1 },
  },
  required: ["first", "second", "suppliedCosine"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cosine: { type: "number" }, residual: { type: "number" } },
  required: ["cosine", "residual"],
} as const;
/** Calculate vector normalized dot residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, suppliedCosine } = request;
  const compute = (): Output => {
    H.sameLength(first, second);
    H.domain(suppliedCosine >= -1 && suppliedCosine <= 1, "suppliedCosine");
    const unit = (v: readonly number[], field: string) => {
      const scale = Math.max(...v.map(Math.abs));
      H.domain(v.length > 0 && scale > 0, field, "Provide a nonzero vector.");
      const scaled = v.map((x) => x / scale),
        norm = Math.hypot(...scaled);
      return scaled.map((x) => x / norm);
    };
    const cosine = H.dot(unit(first, "first"), unit(second, "second"));
    return { cosine, residual: suppliedCosine - cosine };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: [3, 0], second: [0, 4], suppliedCosine: 0.2 },
  output: { cosine: 0, residual: 0.2 },
} satisfies ToolExample<Input, Output>;
export const vectorNormalizedDotResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-normalized-dot-residual",
    title: "Vector Normalized Dot Residual Tool",
    description:
      "Calculate vector normalized dot residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "array", maxItems: 256, items: { type: "number" } },
        second: { type: "array", maxItems: 256, items: { type: "number" } },
        suppliedCosine: { type: "number", minimum: -1 },
      },
      required: ["first", "second", "suppliedCosine"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cosine: { type: "number" }, residual: { type: "number" } },
      required: ["cosine", "residual"],
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
          id: "suppliedCosine",
          label: "Supplied Cosine",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "cosine", label: "Cosine", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = vectorNormalizedDotResidualTool.execute;
export default vectorNormalizedDotResidualTool;

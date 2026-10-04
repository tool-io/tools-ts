import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly number[];
  readonly second: readonly number[];
};
export type Output = { readonly direction: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    second: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    direction: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["direction"],
} as const;
/** Calculate vector angle bisector equal norm case from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.sameLength(first, second);
    const n = Math.hypot(...first),
      m = Math.hypot(...second);
    H.domain(n > 0 && Math.abs(n - m) <= 1e-12 * Math.max(n, m));
    const sum = first.map((x, i) => x + second[i]),
      norm = Math.hypot(...sum);
    H.positive(norm);
    return { direction: sum.map((x) => x / norm) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: [3, 0], second: [0, 3] },
  output: { direction: [0.7071067811865475, 0.7071067811865475] },
} satisfies ToolExample<Input, Output>;
export const vectorAngleBisectorEqualNormCaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-angle-bisector-equal-norm-case",
    title: "Vector Angle Bisector Equal Norm Case Tool",
    description:
      "Calculate vector angle bisector equal norm case from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "array", maxItems: 256, items: { type: "number" } },
        second: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        direction: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["direction"],
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
      ],
      outputs: [
        {
          id: "direction",
          label: "Direction",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = vectorAngleBisectorEqualNormCaseTool.execute;
export default vectorAngleBisectorEqualNormCaseTool;

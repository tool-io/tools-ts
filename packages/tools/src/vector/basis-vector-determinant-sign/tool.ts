import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly basis: readonly (readonly number[])[] };
export type Output = { readonly sign: number; readonly singular: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    basis: {
      type: "array",
      maxItems: 128,
      items: { type: "array", maxItems: 128, items: { type: "number" } },
    },
  },
  required: ["basis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sign: { type: "integer" }, singular: { type: "boolean" } },
  required: ["sign", "singular"],
} as const;
/** Inspect floating-point orientation of a supplied 3D basis after row scaling; no exact-predicate guarantee. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { basis } = request;
  const compute = (): Output => {
    H.domain(basis.length === 3 && basis.every((r) => r.length === 3));
    return (() => {
      const s = basis.map((r) => Math.max(...r.map(Math.abs)));
      if (s.some((x) => x === 0)) return { sign: 0, singular: true };
      const b = basis.map((r, i) => r.map((x) => x / s[i]));
      const d =
        b[0][0] * (b[1][1] * b[2][2] - b[1][2] * b[2][1]) -
        b[0][1] * (b[1][0] * b[2][2] - b[1][2] * b[2][0]) +
        b[0][2] * (b[1][0] * b[2][1] - b[1][1] * b[2][0]);
      return { sign: Math.sign(d), singular: d === 0 };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    basis: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, -1],
    ],
  },
  output: { sign: -1, singular: false },
} satisfies ToolExample<Input, Output>;
export const basisVectorDeterminantSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/basis-vector-determinant-sign",
    title: "Basis Vector Determinant Sign Tool",
    description:
      "Inspect floating-point orientation of a supplied 3D basis after row scaling; no exact-predicate guarantee.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        basis: {
          type: "array",
          maxItems: 128,
          items: { type: "array", maxItems: 128, items: { type: "number" } },
        },
      },
      required: ["basis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sign: { type: "integer" }, singular: { type: "boolean" } },
      required: ["sign", "singular"],
    },
    ports: {
      inputs: [
        {
          id: "basis",
          label: "Basis",
          required: true,
          valueType: {
            type: "list",
            items: { type: "list", items: { type: "number" } },
          },
        },
      ],
      outputs: [
        { id: "sign", label: "Sign", valueType: { type: "integer" } },
        { id: "singular", label: "Singular", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = basisVectorDeterminantSignTool.execute;
export default basisVectorDeterminantSignTool;

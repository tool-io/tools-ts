import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly a: readonly number[];
  readonly b: readonly number[];
  readonly c: readonly number[];
  readonly opposite: readonly number[];
};
export type Output = {
  readonly signedDot: number;
  readonly outwardNormal: readonly number[];
  readonly degenerate: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    a: { type: "array", maxItems: 256, items: { type: "number" } },
    b: { type: "array", maxItems: 256, items: { type: "number" } },
    c: { type: "array", maxItems: 256, items: { type: "number" } },
    opposite: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["a", "b", "c", "opposite"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDot: { type: "number" },
    outwardNormal: { type: "array", maxItems: 256, items: { type: "number" } },
    degenerate: { type: "boolean" },
  },
  required: ["signedDot", "outwardNormal", "degenerate"],
} as const;
/** Orient the supplied triangular face away from the opposite vertex using a scalar triple-product sign. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { a, b, c, opposite } = request;
  const compute = (): Output => {
    H.domain([a, b, c, opposite].every((x) => x.length === 3));
    const u = b.map((x, i) => x - a[i]),
      v = c.map((x, i) => x - a[i]),
      n = [
        u[1] * v[2] - u[2] * v[1],
        u[2] * v[0] - u[0] * v[2],
        u[0] * v[1] - u[1] * v[0],
      ],
      signedDot = H.dot(
        n,
        opposite.map((x, i) => x - a[i]),
      );
    return {
      signedDot,
      outwardNormal: n.map((x) => (signedDot > 0 ? -x : x)),
      degenerate: signedDot === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { a: [0, 0, 0], b: [1, 0, 0], c: [0, 1, 0], opposite: [0, 0, 1] },
  output: { signedDot: 1, outwardNormal: [0, 0, -1], degenerate: false },
} satisfies ToolExample<Input, Output>;
export const tetrahedronFaceNormalOrientationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/tetrahedron-face-normal-orientation",
    title: "Tetrahedron Face Normal Orientation Tool",
    description:
      "Orient the supplied triangular face away from the opposite vertex using a scalar triple-product sign.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        a: { type: "array", maxItems: 256, items: { type: "number" } },
        b: { type: "array", maxItems: 256, items: { type: "number" } },
        c: { type: "array", maxItems: 256, items: { type: "number" } },
        opposite: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["a", "b", "c", "opposite"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedDot: { type: "number" },
        outwardNormal: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        degenerate: { type: "boolean" },
      },
      required: ["signedDot", "outwardNormal", "degenerate"],
    },
    ports: {
      inputs: [
        {
          id: "a",
          label: "A",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "b",
          label: "B",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "c",
          label: "C",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "opposite",
          label: "Opposite",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "signedDot", label: "Signed Dot", valueType: { type: "number" } },
        {
          id: "outwardNormal",
          label: "Outward Normal",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "degenerate",
          label: "Degenerate",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = tetrahedronFaceNormalOrientationTool.execute;
export default tetrahedronFaceNormalOrientationTool;

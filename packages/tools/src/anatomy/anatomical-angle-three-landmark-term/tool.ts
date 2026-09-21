import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly number[];
  readonly vertex: readonly number[];
  readonly last: readonly number[];
};
export type Output = { readonly angleRadians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    vertex: { type: "array", maxItems: 256, items: { type: "number" } },
    last: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["first", "vertex", "last"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { angleRadians: { type: "number" } },
  required: ["angleRadians"],
} as const;
/** Unsigned interior three-landmark angle in radians from explicit coordinates; does not assign an anatomical angle convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, vertex, last } = request;
  const compute = (): Output => {
    H.domain(first.length === 3 && vertex.length === 3 && last.length === 3);
    const a = first.map((x, i) => x - vertex[i]),
      b = last.map((x, i) => x - vertex[i]),
      aLength = Math.hypot(...a),
      bLength = Math.hypot(...b);
    H.positive(aLength);
    H.positive(bLength);
    const cosine = H.dot(
      a.map((x) => x / aLength),
      b.map((x) => x / bLength),
    );
    return { angleRadians: Math.acos(Math.max(-1, Math.min(1, cosine))) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: [1, 0, 0], vertex: [0, 0, 0], last: [0, 1, 0] },
  output: { angleRadians: 1.5707963267948966 },
} satisfies ToolExample<Input, Output>;
export const anatomicalAngleThreeLandmarkTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anatomy/anatomical-angle-three-landmark-term",
    title: "Anatomical Angle Three Landmark Term Tool",
    description:
      "Unsigned interior three-landmark angle in radians from explicit coordinates; does not assign an anatomical angle convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "array", maxItems: 256, items: { type: "number" } },
        vertex: { type: "array", maxItems: 256, items: { type: "number" } },
        last: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["first", "vertex", "last"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { angleRadians: { type: "number" } },
      required: ["angleRadians"],
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
          id: "vertex",
          label: "Vertex",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "last",
          label: "Last",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "angleRadians",
          label: "Angle Radians",
          valueType: { type: "number", unit: "rad" },
        },
      ],
    },
  },
  calculate,
});
export const run = anatomicalAngleThreeLandmarkTermTool.execute;
export default anatomicalAngleThreeLandmarkTermTool;

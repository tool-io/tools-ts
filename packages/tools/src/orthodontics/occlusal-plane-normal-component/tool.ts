import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vector: readonly number[];
  readonly normal: readonly number[];
};
export type Output = { readonly normalComponent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vector: { type: "array", maxItems: 256, items: { type: "number" } },
    normal: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["vector", "normal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalComponent: { type: "number" } },
  required: ["normalComponent"],
} as const;
/** Project a supplied research vector onto an explicitly provided plane normal; no occlusion or clinical inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vector, normal } = request;
  const compute = (): Output => {
    H.domain(vector.length === 3 && normal.length === 3);
    const scale = Math.max(...normal.map(Math.abs));
    H.domain(scale > 0, "normal");
    const v = normal.map((x) => x / scale),
      norm = Math.hypot(...v);
    return {
      normalComponent: H.dot(
        vector,
        v.map((x) => x / norm),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vector: [3, 4, 5], normal: [0, 0, 2] },
  output: { normalComponent: 5 },
} satisfies ToolExample<Input, Output>;
export const occlusalPlaneNormalComponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthodontics/occlusal-plane-normal-component",
    title: "Occlusal Plane Normal Component Tool",
    description:
      "Project a supplied research vector onto an explicitly provided plane normal; no occlusion or clinical inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vector: { type: "array", maxItems: 256, items: { type: "number" } },
        normal: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["vector", "normal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { normalComponent: { type: "number" } },
      required: ["normalComponent"],
    },
    ports: {
      inputs: [
        {
          id: "vector",
          label: "Vector",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "normal",
          label: "Normal",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "normalComponent",
          label: "Normal Component",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = occlusalPlaneNormalComponentTool.execute;
export default occlusalPlaneNormalComponentTool;

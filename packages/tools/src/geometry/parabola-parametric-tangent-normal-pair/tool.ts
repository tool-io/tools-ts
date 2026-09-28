import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly parameter: number; readonly scale: number };
export type Output = {
  readonly tangent: readonly number[];
  readonly normal: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { parameter: { type: "number" }, scale: { type: "number" } },
  required: ["parameter", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tangent: { type: "array", maxItems: 256, items: { type: "number" } },
    normal: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["tangent", "normal"],
} as const;
/** Return perpendicular tangent and left normal for the parabola (a*t²,2*a*t). */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { parameter, scale } = input;
  const compute = (): Output => {
    H.domain(scale !== 0);
    return {
      tangent: [2 * scale * parameter, 2 * scale],
      normal: [-2 * scale, 2 * scale * parameter],
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { parameter: 2, scale: 3 },
  output: { tangent: [12, 6], normal: [-6, 12] },
} satisfies ToolExample<Input, Output>;
export const parabolaParametricTangentNormalPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geometry/parabola-parametric-tangent-normal-pair",
      title: "Parabola Parametric Tangent Normal Pair Tool",
      description:
        "Return perpendicular tangent and left normal for the parabola (a*t²,2*a*t).",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parameter: { type: "number" },
          scale: { type: "number" },
        },
        required: ["parameter", "scale"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tangent: { type: "array", maxItems: 256, items: { type: "number" } },
          normal: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["tangent", "normal"],
      },
      ports: {
        inputs: [
          {
            id: "parameter",
            label: "Parameter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "scale",
            label: "Scale",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "tangent",
            label: "Tangent",
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "normal",
            label: "Normal",
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = parabolaParametricTangentNormalPairTool.execute;
export default parabolaParametricTangentNormalPairTool;

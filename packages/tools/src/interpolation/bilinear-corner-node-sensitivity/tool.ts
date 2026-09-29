import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly u: number;
  readonly v: number;
  readonly cornerX: number;
  readonly cornerY: number;
};
export type Output = { readonly weight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    u: { type: "number" },
    v: { type: "number" },
    cornerX: { type: "integer", minimum: 0, maximum: 1 },
    cornerY: { type: "integer", minimum: 0, maximum: 1 },
  },
  required: ["u", "v", "cornerX", "cornerY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weight: { type: "number" } },
  required: ["weight"],
} as const;
/** Calculate bilinear corner node sensitivity from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { u, v, cornerX, cornerY } = input;
  const compute = (): Output => {
    H.integer(cornerX, 0, 1);
    H.integer(cornerY, 0, 1);
    return { weight: (cornerX ? u : 1 - u) * (cornerY ? v : 1 - v) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { u: 0.25, v: 0.5, cornerX: 1, cornerY: 0 },
  output: { weight: 0.125 },
} satisfies ToolExample<Input, Output>;
export const bilinearCornerNodeSensitivityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/bilinear-corner-node-sensitivity",
    title: "Bilinear Corner Node Sensitivity Tool",
    description:
      "Calculate bilinear corner node sensitivity from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        u: { type: "number" },
        v: { type: "number" },
        cornerX: { type: "integer", minimum: 0, maximum: 1 },
        cornerY: { type: "integer", minimum: 0, maximum: 1 },
      },
      required: ["u", "v", "cornerX", "cornerY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weight: { type: "number" } },
      required: ["weight"],
    },
    ports: {
      inputs: [
        { id: "u", label: "U", required: true, valueType: { type: "number" } },
        { id: "v", label: "V", required: true, valueType: { type: "number" } },
        {
          id: "cornerX",
          label: "Corner X",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cornerY",
          label: "Corner Y",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "weight", label: "Weight", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = bilinearCornerNodeSensitivityTool.execute;
export default bilinearCornerNodeSensitivityTool;

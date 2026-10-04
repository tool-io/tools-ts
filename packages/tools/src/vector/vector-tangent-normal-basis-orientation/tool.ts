import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tangent: readonly number[];
  readonly normal: readonly number[];
};
export type Output = {
  readonly determinant: number;
  readonly orientation: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tangent: { type: "array", maxItems: 256, items: { type: "number" } },
    normal: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["tangent", "normal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    determinant: { type: "number" },
    orientation: { type: "string", maxLength: 8192 },
  },
  required: ["determinant", "orientation"],
} as const;
/** Calculate vector tangent normal basis orientation from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { tangent, normal } = input;
  const compute = (): Output => {
    H.domain(tangent.length === 2 && normal.length === 2);
    const determinant = tangent[0] * normal[1] - tangent[1] * normal[0];
    return {
      determinant,
      orientation:
        determinant > 0
          ? "counterclockwise"
          : determinant < 0
            ? "clockwise"
            : "degenerate",
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { tangent: [1, 0], normal: [0, 2] },
  output: { determinant: 2, orientation: "counterclockwise" },
} satisfies ToolExample<Input, Output>;
export const vectorTangentNormalBasisOrientationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vector/vector-tangent-normal-basis-orientation",
      title: "Vector Tangent Normal Basis Orientation Tool",
      description:
        "Calculate vector tangent normal basis orientation from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tangent: { type: "array", maxItems: 256, items: { type: "number" } },
          normal: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["tangent", "normal"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          determinant: { type: "number" },
          orientation: { type: "string", maxLength: 8192 },
        },
        required: ["determinant", "orientation"],
      },
      ports: {
        inputs: [
          {
            id: "tangent",
            label: "Tangent",
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
            id: "determinant",
            label: "Determinant",
            valueType: { type: "number" },
          },
          {
            id: "orientation",
            label: "Orientation",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = vectorTangentNormalBasisOrientationTool.execute;
export default vectorTangentNormalBasisOrientationTool;

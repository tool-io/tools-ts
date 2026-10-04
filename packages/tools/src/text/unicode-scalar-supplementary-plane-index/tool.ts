import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  codePoint,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly point: number };
export type Output = {
  readonly plane: number;
  readonly planeOffset: number;
  readonly supplementary: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { point: { type: "integer" } },
  required: ["point"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plane: { type: "integer" },
    planeOffset: { type: "integer" },
    supplementary: { type: "boolean" },
  },
  required: ["plane", "planeOffset", "supplementary"],
} as const;
/** Compute unicode scalar supplementary plane index from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { point } = input;
  const compute = (): Output => {
    codePoint(point);
    return {
      plane: Math.floor(point / 65536),
      planeOffset: point % 65536,
      supplementary: point >= 65536,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { point: 128512 },
  output: { plane: 1, planeOffset: 62976, supplementary: true },
} satisfies ToolExample<Input, Output>;
export const unicodeScalarSupplementaryPlaneIndexTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "text/unicode-scalar-supplementary-plane-index",
  title: "Unicode Scalar Supplementary Plane Index Tool",
  description:
    "Compute unicode scalar supplementary plane index from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "point",
        label: "Point",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "plane", label: "Plane", valueType: { type: "integer" } },
      {
        id: "planeOffset",
        label: "Plane Offset",
        valueType: { type: "integer" },
      },
      {
        id: "supplementary",
        label: "Supplementary",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = unicodeScalarSupplementaryPlaneIndexTool.execute;
export default unicodeScalarSupplementaryPlaneIndexTool;

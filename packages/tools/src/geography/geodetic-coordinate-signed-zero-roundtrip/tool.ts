import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly magnitude: number; readonly negative: boolean };
export type Output = {
  readonly text: string;
  readonly magnitude: number;
  readonly negative: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    magnitude: { type: "number", minimum: 0 },
    negative: { type: "boolean" },
  },
  required: ["magnitude", "negative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    magnitude: { type: "number" },
    negative: { type: "boolean" },
  },
  required: ["text", "magnitude", "negative"],
} as const;
/** Serialize a coordinate sign separately from nonnegative magnitude so a negative-zero hemisphere survives JSON. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { magnitude, negative } = input;
  const compute = (): Output => {
    H.domain(magnitude >= 0);
    return { text: (negative ? "-" : "+") + magnitude, magnitude, negative };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { magnitude: 0, negative: true },
  output: { text: "-0", magnitude: 0, negative: true },
} satisfies ToolExample<Input, Output>;
export const geodeticCoordinateSignedZeroRoundtripTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geography/geodetic-coordinate-signed-zero-roundtrip",
      title: "Geodetic Coordinate Signed Zero Roundtrip Tool",
      description:
        "Serialize a coordinate sign separately from nonnegative magnitude so a negative-zero hemisphere survives JSON.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          magnitude: { type: "number", minimum: 0 },
          negative: { type: "boolean" },
        },
        required: ["magnitude", "negative"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: { type: "string", maxLength: 8192 },
          magnitude: { type: "number" },
          negative: { type: "boolean" },
        },
        required: ["text", "magnitude", "negative"],
      },
      ports: {
        inputs: [
          {
            id: "magnitude",
            label: "Magnitude",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "negative",
            label: "Negative",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "text", label: "Text", valueType: { type: "string" } },
          {
            id: "magnitude",
            label: "Magnitude",
            valueType: { type: "number" },
          },
          { id: "negative", label: "Negative", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = geodeticCoordinateSignedZeroRoundtripTool.execute;
export default geodeticCoordinateSignedZeroRoundtripTool;

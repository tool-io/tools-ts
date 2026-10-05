import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly minimum: number;
  readonly maximum: number;
};
export type Output = { readonly normalized: number; readonly clipped: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    minimum: { type: "number" },
    maximum: { type: "number" },
  },
  required: ["value", "minimum", "maximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalized: { type: "number" }, clipped: { type: "boolean" } },
  required: ["normalized", "clipped"],
} as const;
/** Map a scalar to a unit interval after clipping to explicit distinct minimum and maximum values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, minimum, maximum } = request;
  const compute = (): Output => {
    H.domain(minimum < maximum, "maximum");
    return {
      normalized:
        (Math.min(maximum, Math.max(minimum, value)) - minimum) /
        (maximum - minimum),
      clipped: value < minimum || value > maximum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 15, minimum: 0, maximum: 10 },
  output: { normalized: 1, clipped: true },
} satisfies ToolExample<Input, Output>;
export const clippedMinmaxScalarTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "normalize/clipped-minmax-scalar",
      title: "Clipped Minmax Scalar Tool",
      description:
        "Map a scalar to a unit interval after clipping to explicit distinct minimum and maximum values.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          value: { type: "number" },
          minimum: { type: "number" },
          maximum: { type: "number" },
        },
        required: ["value", "minimum", "maximum"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          normalized: { type: "number" },
          clipped: { type: "boolean" },
        },
        required: ["normalized", "clipped"],
      },
      ports: {
        inputs: [
          {
            id: "value",
            label: "Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minimum",
            label: "Minimum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "maximum",
            label: "Maximum",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "normalized",
            label: "Normalized",
            valueType: { type: "number" },
          },
          { id: "clipped", label: "Clipped", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  },
);
export const run = clippedMinmaxScalarTool.execute;
export default clippedMinmaxScalarTool;

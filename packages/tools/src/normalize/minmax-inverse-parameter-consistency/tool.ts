import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly normalized: number;
  readonly minimum: number;
  readonly maximum: number;
};
export type Output = {
  readonly reconstructed: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    normalized: { type: "number" },
    minimum: { type: "number" },
    maximum: { type: "number" },
  },
  required: ["value", "normalized", "minimum", "maximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reconstructed: { type: "number" },
    residual: { type: "number" },
  },
  required: ["reconstructed", "residual"],
} as const;
/** Calculate minmax inverse parameter consistency from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, normalized, minimum, maximum } = request;
  const compute = (): Output => {
    H.domain(minimum < maximum);
    const reconstructed = minimum + normalized * (maximum - minimum);
    return { reconstructed, residual: value - reconstructed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 7, normalized: 0.5, minimum: 2, maximum: 10 },
  output: { reconstructed: 6, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const minmaxInverseParameterConsistencyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/minmax-inverse-parameter-consistency",
    title: "Minmax Inverse Parameter Consistency Tool",
    description:
      "Calculate minmax inverse parameter consistency from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        normalized: { type: "number" },
        minimum: { type: "number" },
        maximum: { type: "number" },
      },
      required: ["value", "normalized", "minimum", "maximum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reconstructed: { type: "number" },
        residual: { type: "number" },
      },
      required: ["reconstructed", "residual"],
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
          id: "normalized",
          label: "Normalized",
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
          id: "reconstructed",
          label: "Reconstructed",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = minmaxInverseParameterConsistencyTool.execute;
export default minmaxInverseParameterConsistencyTool;

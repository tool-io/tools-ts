import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly factor: number;
  readonly offset: number;
};
export type Output = { readonly converted: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    factor: { type: "number", exclusiveMinimum: 0 },
    offset: { type: "number" },
  },
  required: ["value", "factor", "offset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { converted: { type: "number" } },
  required: ["converted"],
} as const;
/** Apply an explicit affine research signal calibration without clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, factor, offset } = request;
  const compute = (): Output => {
    H.positive(factor);
    return { converted: value * factor + offset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 2, factor: 10, offset: 1 },
  output: { converted: 21 },
} satisfies ToolExample<Input, Output>;
export const physiologicalChannelUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/physiological-channel-unit-factor",
    title: "Physiological Channel Unit Factor Tool",
    description:
      "Apply an explicit affine research signal calibration without clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        factor: { type: "number", exclusiveMinimum: 0 },
        offset: { type: "number" },
      },
      required: ["value", "factor", "offset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { converted: { type: "number" } },
      required: ["converted"],
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
          id: "factor",
          label: "Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "converted", label: "Converted", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = physiologicalChannelUnitFactorTool.execute;
export default physiologicalChannelUnitFactorTool;

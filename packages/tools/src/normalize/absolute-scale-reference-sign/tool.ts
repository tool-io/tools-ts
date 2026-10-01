import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly scale: number;
  readonly reference: number;
};
export type Output = {
  readonly scaledMagnitude: number;
  readonly relativeSign: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    scale: { type: "number", exclusiveMinimum: 0 },
    reference: { type: "number", minimum: 0 },
  },
  required: ["value", "scale", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaledMagnitude: { type: "number" },
    relativeSign: { type: "integer" },
  },
  required: ["scaledMagnitude", "relativeSign"],
} as const;
/** Calculate absolute scale reference sign from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, scale, reference } = request;
  const compute = (): Output => {
    H.positive(scale);
    H.domain(reference >= 0);
    return {
      scaledMagnitude: Math.abs(value) / scale,
      relativeSign: Math.sign(Math.abs(value) / scale - reference),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: -6, scale: 2, reference: 2 },
  output: { scaledMagnitude: 3, relativeSign: 1 },
} satisfies ToolExample<Input, Output>;
export const absoluteScaleReferenceSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/absolute-scale-reference-sign",
    title: "Absolute Scale Reference Sign Tool",
    description:
      "Calculate absolute scale reference sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        scale: { type: "number", exclusiveMinimum: 0 },
        reference: { type: "number", minimum: 0 },
      },
      required: ["value", "scale", "reference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaledMagnitude: { type: "number" },
        relativeSign: { type: "integer" },
      },
      required: ["scaledMagnitude", "relativeSign"],
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
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaledMagnitude",
          label: "Scaled Magnitude",
          valueType: { type: "number" },
        },
        {
          id: "relativeSign",
          label: "Relative Sign",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = absoluteScaleReferenceSignTool.execute;
export default absoluteScaleReferenceSignTool;

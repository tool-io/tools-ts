import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly normalized: number;
  readonly scale: number;
  readonly center: number;
};
export type Output = {
  readonly original: number;
  readonly offsetContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalized: { type: "number" },
    scale: { type: "number" },
    center: { type: "number" },
  },
  required: ["normalized", "scale", "center"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    original: { type: "number" },
    offsetContribution: { type: "number" },
  },
  required: ["original", "offsetContribution"],
} as const;
/** Calculate normalizer center inverse offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { normalized, scale, center } = request;
  const compute = (): Output => {
    H.domain(scale !== 0);
    return {
      original: normalized * scale + center,
      offsetContribution: center,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { normalized: 2, scale: 3, center: 10 },
  output: { original: 16, offsetContribution: 10 },
} satisfies ToolExample<Input, Output>;
export const normalizerCenterInverseOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/normalizer-center-inverse-offset",
    title: "Normalizer Center Inverse Offset Tool",
    description:
      "Calculate normalizer center inverse offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalized: { type: "number" },
        scale: { type: "number" },
        center: { type: "number" },
      },
      required: ["normalized", "scale", "center"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        original: { type: "number" },
        offsetContribution: { type: "number" },
      },
      required: ["original", "offsetContribution"],
    },
    ports: {
      inputs: [
        {
          id: "normalized",
          label: "Normalized",
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
          id: "center",
          label: "Center",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "original", label: "Original", valueType: { type: "number" } },
        {
          id: "offsetContribution",
          label: "Offset Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = normalizerCenterInverseOffsetTool.execute;
export default normalizerCenterInverseOffsetTool;

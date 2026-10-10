import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly standardLength: number;
  readonly bodyDepth: number;
};
export type Output = { readonly lengthToDepthRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    standardLength: { type: "number", minimum: 0 },
    bodyDepth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["standardLength", "bodyDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lengthToDepthRatio: { type: "number" } },
  required: ["lengthToDepthRatio"],
} as const;
/** Divide explicitly supplied fish standard length by positive body depth without inferring species, age or condition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { standardLength, bodyDepth } = request;
  const compute = (): Output => {
    H.domain(standardLength >= 0, "standardLength");
    (H.domain(Number.isFinite(bodyDepth) && bodyDepth > 0, "bodyDepth"),
      bodyDepth);
    return { lengthToDepthRatio: standardLength / bodyDepth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { standardLength: 120, bodyDepth: 30 },
  output: { lengthToDepthRatio: 4 },
} satisfies ToolExample<Input, Output>;
export const fishStandardlengthBodydepthRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/fish-standardlength-bodydepth-ratio",
    title: "Fish Standardlength Bodydepth Ratio Tool",
    description:
      "Divide explicitly supplied fish standard length by positive body depth without inferring species, age or condition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        standardLength: { type: "number", minimum: 0 },
        bodyDepth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["standardLength", "bodyDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lengthToDepthRatio: { type: "number" } },
      required: ["lengthToDepthRatio"],
    },
    ports: {
      inputs: [
        {
          id: "standardLength",
          label: "Standard Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bodyDepth",
          label: "Body Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lengthToDepthRatio",
          label: "Length To Depth Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fishStandardlengthBodydepthRatioTool.execute;
export default fishStandardlengthBodydepthRatioTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPosition: number;
  readonly secondPosition: number;
  readonly suppliedNominalSpacing: number;
};
export type Output = {
  readonly signedSpacing: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPosition: { type: "number" },
    secondPosition: { type: "number" },
    suppliedNominalSpacing: { type: "number", minimum: 0 },
  },
  required: ["firstPosition", "secondPosition", "suppliedNominalSpacing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedSpacing: { type: "number" },
    residual: { type: "number" },
  },
  required: ["signedSpacing", "residual"],
} as const;
/** Compare supplied slice-position spacing with a nominal reference; no substitution of slice thickness or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPosition, secondPosition, suppliedNominalSpacing } = request;
  const compute = (): Output => {
    H.domain(suppliedNominalSpacing >= 0);
    return {
      signedSpacing: secondPosition - firstPosition,
      residual:
        Math.abs(secondPosition - firstPosition) - suppliedNominalSpacing,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPosition: 10, secondPosition: 13, suppliedNominalSpacing: 2 },
  output: { signedSpacing: 3, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const imageSliceSpacingResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/image-slice-spacing-residual",
    title: "Image Slice Spacing Residual Tool",
    description:
      "Compare supplied slice-position spacing with a nominal reference; no substitution of slice thickness or clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPosition: { type: "number" },
        secondPosition: { type: "number" },
        suppliedNominalSpacing: { type: "number", minimum: 0 },
      },
      required: ["firstPosition", "secondPosition", "suppliedNominalSpacing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedSpacing: { type: "number" },
        residual: { type: "number" },
      },
      required: ["signedSpacing", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "firstPosition",
          label: "First Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondPosition",
          label: "Second Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedNominalSpacing",
          label: "Supplied Nominal Spacing",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedSpacing",
          label: "Signed Spacing",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = imageSliceSpacingResidualTool.execute;
export default imageSliceSpacingResidualTool;

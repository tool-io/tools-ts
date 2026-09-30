import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly leftHeight: number;
  readonly rightHeight: number;
  readonly length: number;
};
export type Output = {
  readonly signedArea: number;
  readonly signedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number", minimum: 0 },
    leftHeight: { type: "number" },
    rightHeight: { type: "number" },
    length: { type: "number", minimum: 0 },
  },
  required: ["width", "leftHeight", "rightHeight", "length"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedArea: { type: "number" },
    signedVolume: { type: "number" },
  },
  required: ["signedArea", "signedVolume"],
} as const;
/** Signed trapezoid cut/fill area and volume; positive heights denote cut and negative heights fill, without separating a zero crossing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, leftHeight, rightHeight, length } = request;
  const compute = (): Output => {
    H.domain(width >= 0 && length >= 0);
    return {
      signedArea: (width * (leftHeight + rightHeight)) / 2,
      signedVolume: (width * (leftHeight + rightHeight) * length) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 4, leftHeight: 1, rightHeight: 2, length: 10 },
  output: { signedArea: 6, signedVolume: 60 },
} satisfies ToolExample<Input, Output>;
export const terraceStepCutfillCrossSectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/terrace-step-cutfill-cross-section",
    title: "Terrace Step Cutfill Cross Section Tool",
    description:
      "Signed trapezoid cut/fill area and volume; positive heights denote cut and negative heights fill, without separating a zero crossing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number", minimum: 0 },
        leftHeight: { type: "number" },
        rightHeight: { type: "number" },
        length: { type: "number", minimum: 0 },
      },
      required: ["width", "leftHeight", "rightHeight", "length"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedArea: { type: "number" },
        signedVolume: { type: "number" },
      },
      required: ["signedArea", "signedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftHeight",
          label: "Left Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightHeight",
          label: "Right Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedArea",
          label: "Signed Area",
          valueType: { type: "number" },
        },
        {
          id: "signedVolume",
          label: "Signed Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = terraceStepCutfillCrossSectionTool.execute;
export default terraceStepCutfillCrossSectionTool;

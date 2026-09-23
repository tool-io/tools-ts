import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageArea: number;
  readonly occludedArea: number;
  readonly excludedBorder: number;
  readonly borderOverlap: number;
};
export type Output = {
  readonly eligibleArea: number;
  readonly eligibleOccluded: number;
  readonly visibleFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageArea: { type: "number" },
    occludedArea: { type: "number", minimum: 0 },
    excludedBorder: { type: "number", minimum: 0 },
    borderOverlap: { type: "number", minimum: 0 },
  },
  required: ["imageArea", "occludedArea", "excludedBorder", "borderOverlap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleArea: { type: "number" },
    eligibleOccluded: { type: "number" },
    visibleFraction: { type: "number" },
  },
  required: ["eligibleArea", "eligibleOccluded", "visibleFraction"],
} as const;
/** Calculate biometric mask occluded area share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageArea, occludedArea, excludedBorder, borderOverlap } = request;
  const compute = (): Output => {
    H.domain(
      imageArea > excludedBorder &&
        excludedBorder >= 0 &&
        occludedArea >= 0 &&
        borderOverlap >= 0 &&
        borderOverlap <= Math.min(occludedArea, excludedBorder) &&
        occludedArea - borderOverlap <= imageArea - excludedBorder,
    );
    return {
      eligibleArea: imageArea - excludedBorder,
      eligibleOccluded: occludedArea - borderOverlap,
      visibleFraction:
        1 - (occludedArea - borderOverlap) / (imageArea - excludedBorder),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    imageArea: 100,
    occludedArea: 30,
    excludedBorder: 10,
    borderOverlap: 5,
  },
  output: {
    eligibleArea: 90,
    eligibleOccluded: 25,
    visibleFraction: 0.7222222222222222,
  },
} satisfies ToolExample<Input, Output>;
export const biometricMaskOccludedAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biometrics/biometric-mask-occluded-area-share",
    title: "Biometric Mask Occluded Area Share Tool",
    description:
      "Calculate biometric mask occluded area share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageArea: { type: "number" },
        occludedArea: { type: "number", minimum: 0 },
        excludedBorder: { type: "number", minimum: 0 },
        borderOverlap: { type: "number", minimum: 0 },
      },
      required: [
        "imageArea",
        "occludedArea",
        "excludedBorder",
        "borderOverlap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleArea: { type: "number" },
        eligibleOccluded: { type: "number" },
        visibleFraction: { type: "number" },
      },
      required: ["eligibleArea", "eligibleOccluded", "visibleFraction"],
    },
    ports: {
      inputs: [
        {
          id: "imageArea",
          label: "Image Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "occludedArea",
          label: "Occluded Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedBorder",
          label: "Excluded Border",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "borderOverlap",
          label: "Border Overlap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleArea",
          label: "Eligible Area",
          valueType: { type: "number" },
        },
        {
          id: "eligibleOccluded",
          label: "Eligible Occluded",
          valueType: { type: "number" },
        },
        {
          id: "visibleFraction",
          label: "Visible Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biometricMaskOccludedAreaShareTool.execute;
export default biometricMaskOccludedAreaShareTool;

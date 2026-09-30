import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stainedArea: number;
  readonly backgroundFalsePositiveArea: number;
  readonly observedArea: number;
  readonly occludedArea: number;
};
export type Output = {
  readonly correctedArea: number;
  readonly visibleArea: number;
  readonly coverage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stainedArea: { type: "number" },
    backgroundFalsePositiveArea: { type: "number", minimum: 0 },
    observedArea: { type: "number" },
    occludedArea: { type: "number", minimum: 0 },
  },
  required: [
    "stainedArea",
    "backgroundFalsePositiveArea",
    "observedArea",
    "occludedArea",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedArea: { type: "number" },
    visibleArea: { type: "number" },
    coverage: { type: "number" },
  },
  required: ["correctedArea", "visibleArea", "coverage"],
} as const;
/** Descriptive stain-positive visible-area fraction for supplied benign-sample segmentation, not a viability or microbial load estimate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    stainedArea,
    backgroundFalsePositiveArea,
    observedArea,
    occludedArea,
  } = request;
  const compute = (): Output => {
    H.domain(
      backgroundFalsePositiveArea >= 0 &&
        stainedArea >= backgroundFalsePositiveArea &&
        occludedArea >= 0 &&
        observedArea > occludedArea &&
        stainedArea <= observedArea - occludedArea,
    );
    return {
      correctedArea: stainedArea - backgroundFalsePositiveArea,
      visibleArea: observedArea - occludedArea,
      coverage:
        (stainedArea - backgroundFalsePositiveArea) /
        (observedArea - occludedArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stainedArea: 30,
    backgroundFalsePositiveArea: 5,
    observedArea: 100,
    occludedArea: 20,
  },
  output: { correctedArea: 25, visibleArea: 80, coverage: 0.3125 },
} satisfies ToolExample<Input, Output>;
export const benignBiofilmStainedAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microbiology/benign-biofilm-stained-area-share",
    title: "Benign Biofilm Stained Area Share Tool",
    description:
      "Descriptive stain-positive visible-area fraction for supplied benign-sample segmentation, not a viability or microbial load estimate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stainedArea: { type: "number" },
        backgroundFalsePositiveArea: { type: "number", minimum: 0 },
        observedArea: { type: "number" },
        occludedArea: { type: "number", minimum: 0 },
      },
      required: [
        "stainedArea",
        "backgroundFalsePositiveArea",
        "observedArea",
        "occludedArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedArea: { type: "number" },
        visibleArea: { type: "number" },
        coverage: { type: "number" },
      },
      required: ["correctedArea", "visibleArea", "coverage"],
    },
    ports: {
      inputs: [
        {
          id: "stainedArea",
          label: "Stained Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "backgroundFalsePositiveArea",
          label: "Background False Positive Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedArea",
          label: "Observed Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "occludedArea",
          label: "Occluded Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedArea",
          label: "Corrected Area",
          valueType: { type: "number" },
        },
        {
          id: "visibleArea",
          label: "Visible Area",
          valueType: { type: "number" },
        },
        { id: "coverage", label: "Coverage", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = benignBiofilmStainedAreaShareTool.execute;
export default benignBiofilmStainedAreaShareTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalAnnotatedArea: number;
  readonly unobservedArea: number;
  readonly excludedArea: number;
  readonly overlap: number;
};
export type Output = {
  readonly observableArea: number;
  readonly unobservedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalAnnotatedArea: { type: "number" },
    unobservedArea: { type: "number", minimum: 0 },
    excludedArea: { type: "number", minimum: 0 },
    overlap: { type: "number", minimum: 0 },
  },
  required: ["totalAnnotatedArea", "unobservedArea", "excludedArea", "overlap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observableArea: { type: "number" },
    unobservedShare: { type: "number" },
  },
  required: ["observableArea", "unobservedShare"],
} as const;
/** Annotation coverage only, without assessing oral health. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalAnnotatedArea, unobservedArea, excludedArea, overlap } = request;
  const compute = (): Output => {
    H.domain(
      totalAnnotatedArea > excludedArea &&
        excludedArea >= 0 &&
        unobservedArea >= 0 &&
        overlap >= 0 &&
        overlap <= Math.min(unobservedArea, excludedArea) &&
        unobservedArea + excludedArea - overlap <= totalAnnotatedArea,
    );
    return {
      observableArea:
        totalAnnotatedArea - unobservedArea - excludedArea + overlap,
      unobservedShare:
        (unobservedArea - overlap) / (totalAnnotatedArea - excludedArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalAnnotatedArea: 100,
    unobservedArea: 20,
    excludedArea: 10,
    overlap: 5,
  },
  output: { observableArea: 75, unobservedShare: 0.16666666666666666 },
} satisfies ToolExample<Input, Output>;
export const oralPhotoUnobservedAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dental-hygiene/oral-photo-unobserved-area-share",
    title: "Oral Photo Unobserved Area Share Tool",
    description: "Annotation coverage only, without assessing oral health.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalAnnotatedArea: { type: "number" },
        unobservedArea: { type: "number", minimum: 0 },
        excludedArea: { type: "number", minimum: 0 },
        overlap: { type: "number", minimum: 0 },
      },
      required: [
        "totalAnnotatedArea",
        "unobservedArea",
        "excludedArea",
        "overlap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observableArea: { type: "number" },
        unobservedShare: { type: "number" },
      },
      required: ["observableArea", "unobservedShare"],
    },
    ports: {
      inputs: [
        {
          id: "totalAnnotatedArea",
          label: "Total Annotated Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unobservedArea",
          label: "Unobserved Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlap",
          label: "Overlap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observableArea",
          label: "Observable Area",
          valueType: { type: "number" },
        },
        {
          id: "unobservedShare",
          label: "Unobserved Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = oralPhotoUnobservedAreaShareTool.execute;
export default oralPhotoUnobservedAreaShareTool;

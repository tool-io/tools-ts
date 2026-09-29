import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sectionThickness: number;
  readonly collectedSections: number;
  readonly skippedSections: number;
  readonly firstFaceDepth: number;
};
export type Output = {
  readonly collectedThickness: number;
  readonly skippedThickness: number;
  readonly lastFaceDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectionThickness: { type: "number", minimum: 0 },
    collectedSections: { type: "integer", minimum: 0 },
    skippedSections: { type: "integer", minimum: 0 },
    firstFaceDepth: { type: "number", minimum: 0 },
  },
  required: [
    "sectionThickness",
    "collectedSections",
    "skippedSections",
    "firstFaceDepth",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectedThickness: { type: "number" },
    skippedThickness: { type: "number" },
    lastFaceDepth: { type: "number" },
  },
  required: ["collectedThickness", "skippedThickness", "lastFaceDepth"],
} as const;
/** Cumulative removed depth through collected and skipped serial sections, with constant nominal section thickness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sectionThickness,
    collectedSections,
    skippedSections,
    firstFaceDepth,
  } = request;
  const compute = (): Output => {
    H.domain(sectionThickness >= 0 && firstFaceDepth >= 0);
    H.integer(collectedSections, 0);
    H.integer(skippedSections, 0);
    return {
      collectedThickness: sectionThickness * collectedSections,
      skippedThickness: sectionThickness * skippedSections,
      lastFaceDepth:
        firstFaceDepth +
        sectionThickness * (collectedSections + skippedSections),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sectionThickness: 5,
    collectedSections: 10,
    skippedSections: 2,
    firstFaceDepth: 100,
  },
  output: { collectedThickness: 50, skippedThickness: 10, lastFaceDepth: 160 },
} satisfies ToolExample<Input, Output>;
export const tissueSectionSerialGapDepthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/tissue-section-serial-gap-depth-term",
    title: "Tissue Section Serial Gap Depth Term Tool",
    description:
      "Cumulative removed depth through collected and skipped serial sections, with constant nominal section thickness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sectionThickness: { type: "number", minimum: 0 },
        collectedSections: { type: "integer", minimum: 0 },
        skippedSections: { type: "integer", minimum: 0 },
        firstFaceDepth: { type: "number", minimum: 0 },
      },
      required: [
        "sectionThickness",
        "collectedSections",
        "skippedSections",
        "firstFaceDepth",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectedThickness: { type: "number" },
        skippedThickness: { type: "number" },
        lastFaceDepth: { type: "number" },
      },
      required: ["collectedThickness", "skippedThickness", "lastFaceDepth"],
    },
    ports: {
      inputs: [
        {
          id: "sectionThickness",
          label: "Section Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "collectedSections",
          label: "Collected Sections",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "skippedSections",
          label: "Skipped Sections",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstFaceDepth",
          label: "First Face Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "collectedThickness",
          label: "Collected Thickness",
          valueType: { type: "number" },
        },
        {
          id: "skippedThickness",
          label: "Skipped Thickness",
          valueType: { type: "number" },
        },
        {
          id: "lastFaceDepth",
          label: "Last Face Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tissueSectionSerialGapDepthTermTool.execute;
export default tissueSectionSerialGapDepthTermTool;

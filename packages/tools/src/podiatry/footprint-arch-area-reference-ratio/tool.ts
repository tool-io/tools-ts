import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly midfootArea: number;
  readonly totalContactArea: number;
  readonly excludedToeArea: number;
  readonly referenceRatio: number;
};
export type Output = {
  readonly eligibleArea: number;
  readonly ratio: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    midfootArea: { type: "number", minimum: 0 },
    totalContactArea: { type: "number" },
    excludedToeArea: { type: "number", minimum: 0 },
    referenceRatio: { type: "number" },
  },
  required: [
    "midfootArea",
    "totalContactArea",
    "excludedToeArea",
    "referenceRatio",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleArea: { type: "number" },
    ratio: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["eligibleArea", "ratio", "referenceGap"],
} as const;
/** Research footprint ratio with explicitly excluded toe area and supplied reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { midfootArea, totalContactArea, excludedToeArea, referenceRatio } =
    request;
  const compute = (): Output => {
    H.domain(
      totalContactArea > excludedToeArea &&
        excludedToeArea >= 0 &&
        midfootArea >= 0 &&
        midfootArea <= totalContactArea - excludedToeArea,
    );
    return {
      eligibleArea: totalContactArea - excludedToeArea,
      ratio: midfootArea / (totalContactArea - excludedToeArea),
      referenceGap:
        midfootArea / (totalContactArea - excludedToeArea) - referenceRatio,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    midfootArea: 20,
    totalContactArea: 100,
    excludedToeArea: 20,
    referenceRatio: 0.3,
  },
  output: { eligibleArea: 80, ratio: 0.25, referenceGap: -0.04999999999999999 },
} satisfies ToolExample<Input, Output>;
export const footprintArchAreaReferenceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "podiatry/footprint-arch-area-reference-ratio",
    title: "Footprint Arch Area Reference Ratio Tool",
    description:
      "Research footprint ratio with explicitly excluded toe area and supplied reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midfootArea: { type: "number", minimum: 0 },
        totalContactArea: { type: "number" },
        excludedToeArea: { type: "number", minimum: 0 },
        referenceRatio: { type: "number" },
      },
      required: [
        "midfootArea",
        "totalContactArea",
        "excludedToeArea",
        "referenceRatio",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleArea: { type: "number" },
        ratio: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["eligibleArea", "ratio", "referenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "midfootArea",
          label: "Midfoot Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalContactArea",
          label: "Total Contact Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedToeArea",
          label: "Excluded Toe Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceRatio",
          label: "Reference Ratio",
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
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = footprintArchAreaReferenceRatioTool.execute;
export default footprintArchAreaReferenceRatioTool;

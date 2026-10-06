import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalSheetArea: number;
  readonly missingArea: number;
};
export type Output = {
  readonly lossPercent: number;
  readonly remainingArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalSheetArea: { type: "number", exclusiveMinimum: 0 },
    missingArea: { type: "number", minimum: 0 },
  },
  required: ["originalSheetArea", "missingArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lossPercent: { type: "number" },
    remainingArea: { type: "number" },
  },
  required: ["lossPercent", "remainingArea"],
} as const;
/** Quantify measured paper loss relative to an explicitly reconstructed original sheet area without inferring damage severity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalSheetArea, missingArea } = request;
  const compute = (): Output => {
    (H.domain(originalSheetArea > 0, "originalSheetArea"), originalSheetArea);
    H.domain(
      missingArea >= 0 && missingArea <= originalSheetArea,
      "missingArea",
    );
    return {
      lossPercent: (100 * missingArea) / originalSheetArea,
      remainingArea: originalSheetArea - missingArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalSheetArea: 200, missingArea: 10 },
  output: { lossPercent: 5, remainingArea: 190 },
} satisfies ToolExample<Input, Output>;
export const paperLossAreaPercentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-conservation", "art conservation", "arts and design"],
      keywords: ["art conservation", "arts and design"],
    },
    id: "art-conservation/paper-loss-area-percent",
    title: "Paper Loss Area Percent",
    description:
      "Quantify measured paper loss relative to an explicitly reconstructed original sheet area without inferring damage severity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalSheetArea: { type: "number", exclusiveMinimum: 0 },
        missingArea: { type: "number", minimum: 0 },
      },
      required: ["originalSheetArea", "missingArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lossPercent: { type: "number" },
        remainingArea: { type: "number" },
      },
      required: ["lossPercent", "remainingArea"],
    },
    ports: {
      inputs: [
        {
          id: "originalSheetArea",
          label: "Original Sheet Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "missingArea",
          label: "Missing Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lossPercent",
          label: "Loss Percent",
          valueType: { type: "number" },
        },
        {
          id: "remainingArea",
          label: "Remaining Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = paperLossAreaPercentTool.execute;
export default paperLossAreaPercentTool;

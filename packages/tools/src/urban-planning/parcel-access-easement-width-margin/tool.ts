import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedWidth: number;
  readonly suppliedRequiredWidth: number;
};
export type Output = {
  readonly margin: number;
  readonly meetsSuppliedWidth: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedWidth: { type: "number", minimum: 0 },
    suppliedRequiredWidth: { type: "number", minimum: 0 },
  },
  required: ["recordedWidth", "suppliedRequiredWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    margin: { type: "number" },
    meetsSuppliedWidth: { type: "boolean" },
  },
  required: ["margin", "meetsSuppliedWidth"],
} as const;
/** Compare explicit easement width with a supplied requirement without deciding legal access or accessibility compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedWidth, suppliedRequiredWidth } = request;
  const compute = (): Output => {
    H.domain(recordedWidth >= 0 && suppliedRequiredWidth >= 0, "recordedWidth");
    return {
      margin: recordedWidth - suppliedRequiredWidth,
      meetsSuppliedWidth: recordedWidth >= suppliedRequiredWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedWidth: 6, suppliedRequiredWidth: 4 },
  output: { margin: 2, meetsSuppliedWidth: true },
} satisfies ToolExample<Input, Output>;
export const parcelAccessEasementWidthMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["urban-planning", "urban planning", "arts and design"],
      keywords: ["urban planning", "arts and design"],
    },
    id: "urban-planning/parcel-access-easement-width-margin",
    title: "Parcel Access Easement Width Margin",
    description:
      "Compare explicit easement width with a supplied requirement without deciding legal access or accessibility compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedWidth: { type: "number", minimum: 0 },
        suppliedRequiredWidth: { type: "number", minimum: 0 },
      },
      required: ["recordedWidth", "suppliedRequiredWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        margin: { type: "number" },
        meetsSuppliedWidth: { type: "boolean" },
      },
      required: ["margin", "meetsSuppliedWidth"],
    },
    ports: {
      inputs: [
        {
          id: "recordedWidth",
          label: "Recorded Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRequiredWidth",
          label: "Supplied Required Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        {
          id: "meetsSuppliedWidth",
          label: "Meets Supplied Width",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = parcelAccessEasementWidthMarginTool.execute;
export default parcelAccessEasementWidthMarginTool;

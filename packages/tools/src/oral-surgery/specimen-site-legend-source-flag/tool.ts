import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly siteCode: string;
  readonly legendCodes: readonly string[];
  readonly legendLabels: readonly string[];
  readonly legendSource: string;
};
export type Output = {
  readonly known: boolean;
  readonly label: string;
  readonly source: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    siteCode: { type: "string", maxLength: 8192 },
    legendCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    legendLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    legendSource: { type: "string", maxLength: 8192 },
  },
  required: ["siteCode", "legendCodes", "legendLabels", "legendSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    known: { type: "boolean" },
    label: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["known", "label", "source"],
} as const;
/** Resolve an exact specimen legend code while preserving its caller-supplied source label. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { siteCode, legendCodes, legendLabels, legendSource } = request;
  const compute = (): Output => {
    H.sameLength(legendCodes, legendLabels);
    H.domain(new Set(legendCodes).size === legendCodes.length);
    const i = legendCodes.indexOf(siteCode);
    return {
      known: i >= 0,
      label: i >= 0 ? legendLabels[i] : "",
      source: legendSource,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    siteCode: "A",
    legendCodes: ["A", "B"],
    legendLabels: ["left", "right"],
    legendSource: "sheet-2",
  },
  output: { known: true, label: "left", source: "sheet-2" },
} satisfies ToolExample<Input, Output>;
export const specimenSiteLegendSourceFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oral-surgery/specimen-site-legend-source-flag",
    title: "Specimen Site Legend Source Flag Tool",
    description:
      "Resolve an exact specimen legend code while preserving its caller-supplied source label.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        siteCode: { type: "string", maxLength: 8192 },
        legendCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        legendLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        legendSource: { type: "string", maxLength: 8192 },
      },
      required: ["siteCode", "legendCodes", "legendLabels", "legendSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        known: { type: "boolean" },
        label: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["known", "label", "source"],
    },
    ports: {
      inputs: [
        {
          id: "siteCode",
          label: "Site Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "legendCodes",
          label: "Legend Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "legendLabels",
          label: "Legend Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "legendSource",
          label: "Legend Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "known", label: "Known", valueType: { type: "boolean" } },
        { id: "label", label: "Label", valueType: { type: "string" } },
        { id: "source", label: "Source", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = specimenSiteLegendSourceFlagTool.execute;
export default specimenSiteLegendSourceFlagTool;

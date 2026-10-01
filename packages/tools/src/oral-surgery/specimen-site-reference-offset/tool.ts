import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly siteCoordinate: number;
  readonly referenceCoordinate: number;
  readonly suppliedScale: number;
  readonly siteLabel: string;
  readonly source: string;
};
export type Output = { readonly offset: number; readonly sourceKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    siteCoordinate: { type: "number" },
    referenceCoordinate: { type: "number" },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
    siteLabel: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: [
    "siteCoordinate",
    "referenceCoordinate",
    "suppliedScale",
    "siteLabel",
    "source",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offset: { type: "number" },
    sourceKey: { type: "string", maxLength: 8192 },
  },
  required: ["offset", "sourceKey"],
} as const;
/** Resolve one supplied specimen location relative to an explicit research reference and legend, without surgery planning. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    siteCoordinate,
    referenceCoordinate,
    suppliedScale,
    siteLabel,
    source,
  } = request;
  const compute = (): Output => {
    H.positive(suppliedScale);
    return {
      offset: (siteCoordinate - referenceCoordinate) * suppliedScale,
      sourceKey: JSON.stringify([source, siteLabel]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    siteCoordinate: 12,
    referenceCoordinate: 2,
    suppliedScale: 0.5,
    siteLabel: "site-A",
    source: "legend-2",
  },
  output: { offset: 5, sourceKey: '["legend-2","site-A"]' },
} satisfies ToolExample<Input, Output>;
export const specimenSiteReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oral-surgery/specimen-site-reference-offset",
    title: "Specimen Site Reference Offset Tool",
    description:
      "Resolve one supplied specimen location relative to an explicit research reference and legend, without surgery planning.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        siteCoordinate: { type: "number" },
        referenceCoordinate: { type: "number" },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
        siteLabel: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
      },
      required: [
        "siteCoordinate",
        "referenceCoordinate",
        "suppliedScale",
        "siteLabel",
        "source",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offset: { type: "number" },
        sourceKey: { type: "string", maxLength: 8192 },
      },
      required: ["offset", "sourceKey"],
    },
    ports: {
      inputs: [
        {
          id: "siteCoordinate",
          label: "Site Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceCoordinate",
          label: "Reference Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "siteLabel",
          label: "Site Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
        { id: "sourceKey", label: "Source Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = specimenSiteReferenceOffsetTool.execute;
export default specimenSiteReferenceOffsetTool;

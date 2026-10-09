import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly collectionDate: string;
  readonly locationCode: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    collectionDate: { type: "string", maxLength: 8192 },
    locationCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "collectionDate", "locationCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded bathing-water sample date and site without determining bathing suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, collectionDate, locationCode } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    H.domain(specimenId.length > 0 && locationCode.length > 0, "specimenId");
    namedDate(collectionDate, "collectionDate");
    return {
      label:
        specimenId +
        "; collected=" +
        collectionDate +
        " [" +
        locationCode +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenId: "S17",
    collectionDate: "2026-07-01",
    locationCode: "SITE-A",
  },
  output: { label: "S17; collected=2026-07-01 [SITE-A]" },
} satisfies ToolExample<Input, Output>;
export const bathingwaterSampleDateLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "environmental-health",
        "environmental health",
        "health and medicine",
      ],
      keywords: ["environmental health", "health and medicine"],
    },
    id: "environmental-health/bathing-water-sample-date-label",
    title: "Bathing Water Sample Date Label",
    description:
      "Label an explicitly recorded bathing-water sample date and site without determining bathing suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        collectionDate: { type: "string", maxLength: 8192 },
        locationCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "collectionDate", "locationCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "collectionDate",
          label: "Collection Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "locationCode",
          label: "Location Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = bathingwaterSampleDateLabelTool.execute;
export default bathingwaterSampleDateLabelTool;

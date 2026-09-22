import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visitIds: readonly string[];
  readonly taxonIds: readonly string[];
  readonly detected: readonly boolean[];
  readonly selectedTaxon: string;
};
export type Output = {
  readonly surveyedVisits: number;
  readonly detectingVisits: number;
  readonly detectionShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    taxonIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    detected: { type: "array", maxItems: 256, items: { type: "boolean" } },
    selectedTaxon: { type: "string", maxLength: 8192 },
  },
  required: ["visitIds", "taxonIds", "detected", "selectedTaxon"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surveyedVisits: { type: "integer" },
    detectingVisits: { type: "integer" },
    detectionShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["surveyedVisits", "detectingVisits", "detectionShare", "defined"],
} as const;
/** Count distinct visit detection support for one supplied taxon, without estimating occupancy or detection probability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visitIds, taxonIds, detected, selectedTaxon } = request;
  const compute = (): Output => {
    H.sameLength(visitIds, taxonIds);
    H.sameLength(visitIds, detected);
    return (() => {
      const visits = new Set(
          visitIds.filter((x, i) => taxonIds[i] === selectedTaxon),
        ),
        hits = new Set(
          visitIds.filter(
            (x, i) => taxonIds[i] === selectedTaxon && detected[i],
          ),
        );
      return {
        surveyedVisits: visits.size,
        detectingVisits: hits.size,
        detectionShare: visits.size > 0 ? hits.size / visits.size : 0,
        defined: visits.size > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    visitIds: ["v1", "v1", "v2"],
    taxonIds: ["t", "t", "t"],
    detected: [true, false, false],
    selectedTaxon: "t",
  },
  output: {
    surveyedVisits: 2,
    detectingVisits: 1,
    detectionShare: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const surveyVisitDetectionSupportTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biodiversity/survey-visit-detection-support",
    title: "Survey Visit Detection Support Tool",
    description:
      "Count distinct visit detection support for one supplied taxon, without estimating occupancy or detection probability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visitIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        taxonIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        detected: { type: "array", maxItems: 256, items: { type: "boolean" } },
        selectedTaxon: { type: "string", maxLength: 8192 },
      },
      required: ["visitIds", "taxonIds", "detected", "selectedTaxon"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surveyedVisits: { type: "integer" },
        detectingVisits: { type: "integer" },
        detectionShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "surveyedVisits",
        "detectingVisits",
        "detectionShare",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "visitIds",
          label: "Visit Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "taxonIds",
          label: "Taxon Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "detected",
          label: "Detected",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "selectedTaxon",
          label: "Selected Taxon",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "surveyedVisits",
          label: "Surveyed Visits",
          valueType: { type: "integer" },
        },
        {
          id: "detectingVisits",
          label: "Detecting Visits",
          valueType: { type: "integer" },
        },
        {
          id: "detectionShare",
          label: "Detection Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = surveyVisitDetectionSupportTool.execute;
export default surveyVisitDetectionSupportTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimedBirthDay: number;
  readonly documentedBirthDay: number;
  readonly observationDay: number;
};
export type Output = {
  readonly claimedAgeDays: number;
  readonly documentedAgeDays: number;
  readonly discrepancyDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimedBirthDay: { type: "integer" },
    documentedBirthDay: { type: "integer" },
    observationDay: { type: "integer" },
  },
  required: ["claimedBirthDay", "documentedBirthDay", "observationDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimedAgeDays: { type: "integer" },
    documentedAgeDays: { type: "integer" },
    discrepancyDays: { type: "integer" },
  },
  required: ["claimedAgeDays", "documentedAgeDays", "discrepancyDays"],
} as const;
/** Compare two supplied birth-date anchors on an absolute-day axis; no age-document authenticity is established. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimedBirthDay, documentedBirthDay, observationDay } = request;
  const compute = (): Output => {
    H.domain(
      observationDay >= claimedBirthDay && observationDay >= documentedBirthDay,
    );
    return {
      claimedAgeDays: observationDay - claimedBirthDay,
      documentedAgeDays: observationDay - documentedBirthDay,
      discrepancyDays: documentedBirthDay - claimedBirthDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    claimedBirthDay: 100,
    documentedBirthDay: 130,
    observationDay: 36630,
  },
  output: {
    claimedAgeDays: 36530,
    documentedAgeDays: 36500,
    discrepancyDays: 30,
  },
} satisfies ToolExample<Input, Output>;
export const centenarianAgeDocumentDateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/centenarian-age-document-date-gap",
    title: "Centenarian Age Document Date Gap Tool",
    description:
      "Compare two supplied birth-date anchors on an absolute-day axis; no age-document authenticity is established.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimedBirthDay: { type: "integer" },
        documentedBirthDay: { type: "integer" },
        observationDay: { type: "integer" },
      },
      required: ["claimedBirthDay", "documentedBirthDay", "observationDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimedAgeDays: { type: "integer" },
        documentedAgeDays: { type: "integer" },
        discrepancyDays: { type: "integer" },
      },
      required: ["claimedAgeDays", "documentedAgeDays", "discrepancyDays"],
    },
    ports: {
      inputs: [
        {
          id: "claimedBirthDay",
          label: "Claimed Birth Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "documentedBirthDay",
          label: "Documented Birth Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observationDay",
          label: "Observation Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "claimedAgeDays",
          label: "Claimed Age Days",
          valueType: { type: "integer" },
        },
        {
          id: "documentedAgeDays",
          label: "Documented Age Days",
          valueType: { type: "integer" },
        },
        {
          id: "discrepancyDays",
          label: "Discrepancy Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = centenarianAgeDocumentDateGapTool.execute;
export default centenarianAgeDocumentDateGapTool;

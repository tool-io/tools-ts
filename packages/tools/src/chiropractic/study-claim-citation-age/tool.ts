import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimYear: number;
  readonly citedPublicationYear: number;
};
export type Output = {
  readonly citationAgeYears: number;
  readonly futureCitation: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimYear: { type: "integer" },
    citedPublicationYear: { type: "integer" },
  },
  required: ["claimYear", "citedPublicationYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    citationAgeYears: { type: "integer" },
    futureCitation: { type: "boolean" },
  },
  required: ["citationAgeYears", "futureCitation"],
} as const;
/** Inspect supplied publication metadata without evaluating or endorsing a therapeutic claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimYear, citedPublicationYear } = request;
  const compute = (): Output => {
    return {
      citationAgeYears: claimYear - citedPublicationYear,
      futureCitation: citedPublicationYear > claimYear,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { claimYear: 2026, citedPublicationYear: 2020 },
  output: { citationAgeYears: 6, futureCitation: false },
} satisfies ToolExample<Input, Output>;
export const studyClaimCitationAgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chiropractic/study-claim-citation-age",
    title: "Study Claim Citation Age Tool",
    description:
      "Inspect supplied publication metadata without evaluating or endorsing a therapeutic claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimYear: { type: "integer" },
        citedPublicationYear: { type: "integer" },
      },
      required: ["claimYear", "citedPublicationYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        citationAgeYears: { type: "integer" },
        futureCitation: { type: "boolean" },
      },
      required: ["citationAgeYears", "futureCitation"],
    },
    ports: {
      inputs: [
        {
          id: "claimYear",
          label: "Claim Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "citedPublicationYear",
          label: "Cited Publication Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "citationAgeYears",
          label: "Citation Age Years",
          valueType: { type: "integer" },
        },
        {
          id: "futureCitation",
          label: "Future Citation",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = studyClaimCitationAgeTool.execute;
export default studyClaimCitationAgeTool;

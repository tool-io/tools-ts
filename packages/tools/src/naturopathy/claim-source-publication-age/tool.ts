import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimYear: number;
  readonly sourcePublicationYear: number;
  readonly suppliedRevisionYear: number;
  readonly useRevision: boolean;
};
export type Output = { readonly sourceYear: number; readonly ageYears: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimYear: { type: "integer" },
    sourcePublicationYear: { type: "integer" },
    suppliedRevisionYear: { type: "integer" },
    useRevision: { type: "boolean" },
  },
  required: [
    "claimYear",
    "sourcePublicationYear",
    "suppliedRevisionYear",
    "useRevision",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceYear: { type: "integer" },
    ageYears: { type: "integer" },
  },
  required: ["sourceYear", "ageYears"],
} as const;
/** Inspect supplied source/revision metadata without validating or endorsing health claims. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    claimYear,
    sourcePublicationYear,
    suppliedRevisionYear,
    useRevision,
  } = request;
  const compute = (): Output => {
    return {
      sourceYear: useRevision ? suppliedRevisionYear : sourcePublicationYear,
      ageYears:
        claimYear -
        (useRevision ? suppliedRevisionYear : sourcePublicationYear),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    claimYear: 2026,
    sourcePublicationYear: 2000,
    suppliedRevisionYear: 2020,
    useRevision: true,
  },
  output: { sourceYear: 2020, ageYears: 6 },
} satisfies ToolExample<Input, Output>;
export const claimSourcePublicationAgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "naturopathy/claim-source-publication-age",
    title: "Claim Source Publication Age Tool",
    description:
      "Inspect supplied source/revision metadata without validating or endorsing health claims.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimYear: { type: "integer" },
        sourcePublicationYear: { type: "integer" },
        suppliedRevisionYear: { type: "integer" },
        useRevision: { type: "boolean" },
      },
      required: [
        "claimYear",
        "sourcePublicationYear",
        "suppliedRevisionYear",
        "useRevision",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceYear: { type: "integer" },
        ageYears: { type: "integer" },
      },
      required: ["sourceYear", "ageYears"],
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
          id: "sourcePublicationYear",
          label: "Source Publication Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedRevisionYear",
          label: "Supplied Revision Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "useRevision",
          label: "Use Revision",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "sourceYear",
          label: "Source Year",
          valueType: { type: "integer" },
        },
        { id: "ageYears", label: "Age Years", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = claimSourcePublicationAgeTool.execute;
export default claimSourcePublicationAgeTool;

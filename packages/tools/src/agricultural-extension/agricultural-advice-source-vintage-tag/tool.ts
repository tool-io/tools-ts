import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly source: string;
  readonly edition: string;
  readonly issuedYear: number;
  readonly observationYear: number;
  readonly suppliedMaxAge: number;
};
export type Output = {
  readonly ageYears: number;
  readonly withinVintage: boolean;
  readonly key: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
    issuedYear: { type: "integer" },
    observationYear: { type: "integer" },
    suppliedMaxAge: { type: "integer", minimum: 0 },
  },
  required: [
    "source",
    "edition",
    "issuedYear",
    "observationYear",
    "suppliedMaxAge",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageYears: { type: "integer" },
    withinVintage: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["ageYears", "withinVintage", "key"],
} as const;
/** Retain supplied advice provenance and its explicitly defined age limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { source, edition, issuedYear, observationYear, suppliedMaxAge } =
    request;
  const compute = (): Output => {
    H.integer(suppliedMaxAge, 0);
    return {
      ageYears: observationYear - issuedYear,
      withinVintage:
        observationYear >= issuedYear &&
        observationYear - issuedYear <= suppliedMaxAge,
      key: JSON.stringify([source, edition, issuedYear]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    source: "guide-A",
    edition: "v1",
    issuedYear: 2020,
    observationYear: 2026,
    suppliedMaxAge: 5,
  },
  output: { ageYears: 6, withinVintage: false, key: '["guide-A","v1",2020]' },
} satisfies ToolExample<Input, Output>;
export const agriculturalAdviceSourceVintageTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-extension/agricultural-advice-source-vintage-tag",
    title: "Agricultural Advice Source Vintage Tag Tool",
    description:
      "Retain supplied advice provenance and its explicitly defined age limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        source: { type: "string", maxLength: 8192 },
        edition: { type: "string", maxLength: 8192 },
        issuedYear: { type: "integer" },
        observationYear: { type: "integer" },
        suppliedMaxAge: { type: "integer", minimum: 0 },
      },
      required: [
        "source",
        "edition",
        "issuedYear",
        "observationYear",
        "suppliedMaxAge",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageYears: { type: "integer" },
        withinVintage: { type: "boolean" },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["ageYears", "withinVintage", "key"],
    },
    ports: {
      inputs: [
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "issuedYear",
          label: "Issued Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observationYear",
          label: "Observation Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedMaxAge",
          label: "Supplied Max Age",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "ageYears", label: "Age Years", valueType: { type: "integer" } },
        {
          id: "withinVintage",
          label: "Within Vintage",
          valueType: { type: "boolean" },
        },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = agriculturalAdviceSourceVintageTagTool.execute;
export default agriculturalAdviceSourceVintageTagTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly populationCount: number;
  readonly linkedFiscalPersons: number;
  readonly excludedPersons: number;
};
export type Output = { readonly unreconciledPersons: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    populationCount: { type: "integer", minimum: 0 },
    linkedFiscalPersons: { type: "integer", minimum: 0 },
    excludedPersons: { type: "integer", minimum: 0 },
  },
  required: ["populationCount", "linkedFiscalPersons", "excludedPersons"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unreconciledPersons: { type: "integer" } },
  required: ["unreconciledPersons"],
} as const;
/** Reconcile explicit population, linked fiscal-person and excluded-person counts while retaining signed discrepancies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { populationCount, linkedFiscalPersons, excludedPersons } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(populationCount) &&
        populationCount >= 0 &&
        populationCount <= Number.MAX_SAFE_INTEGER,
      "populationCount",
    ),
      populationCount);
    (H.domain(
      Number.isSafeInteger(linkedFiscalPersons) &&
        linkedFiscalPersons >= 0 &&
        linkedFiscalPersons <= Number.MAX_SAFE_INTEGER,
      "linkedFiscalPersons",
    ),
      linkedFiscalPersons);
    (H.domain(
      Number.isSafeInteger(excludedPersons) &&
        excludedPersons >= 0 &&
        excludedPersons <= Number.MAX_SAFE_INTEGER,
      "excludedPersons",
    ),
      excludedPersons);
    return {
      unreconciledPersons:
        populationCount - linkedFiscalPersons - excludedPersons,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    populationCount: 1000,
    linkedFiscalPersons: 850,
    excludedPersons: 100,
  },
  output: { unreconciledPersons: 50 },
} satisfies ToolExample<Input, Output>;
export const populationFiscalPersonResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["demographic-economics", "demographic economics", "economics"],
      keywords: ["demographic economics", "economics"],
    },
    id: "demographic-economics/population-fiscal-person-residual",
    title: "Population Fiscal Person Residual",
    description:
      "Reconcile explicit population, linked fiscal-person and excluded-person counts while retaining signed discrepancies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        populationCount: { type: "integer", minimum: 0 },
        linkedFiscalPersons: { type: "integer", minimum: 0 },
        excludedPersons: { type: "integer", minimum: 0 },
      },
      required: ["populationCount", "linkedFiscalPersons", "excludedPersons"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { unreconciledPersons: { type: "integer" } },
      required: ["unreconciledPersons"],
    },
    ports: {
      inputs: [
        {
          id: "populationCount",
          label: "Population Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "linkedFiscalPersons",
          label: "Linked Fiscal Persons",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedPersons",
          label: "Excluded Persons",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unreconciledPersons",
          label: "Unreconciled Persons",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = populationFiscalPersonResidualTool.execute;
export default populationFiscalPersonResidualTool;

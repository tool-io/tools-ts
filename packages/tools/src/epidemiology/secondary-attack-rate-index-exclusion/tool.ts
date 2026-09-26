import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalExposed: number;
  readonly indexCases: number;
  readonly immuneExcluded: number;
  readonly secondaryCases: number;
};
export type Output = {
  readonly susceptibleContacts: number;
  readonly secondaryAttackRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalExposed: { type: "integer", minimum: 1 },
    indexCases: { type: "integer", minimum: 0 },
    immuneExcluded: { type: "integer", minimum: 0 },
    secondaryCases: { type: "integer", minimum: 0 },
  },
  required: ["totalExposed", "indexCases", "immuneExcluded", "secondaryCases"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    susceptibleContacts: { type: "integer" },
    secondaryAttackRate: { type: "number" },
  },
  required: ["susceptibleContacts", "secondaryAttackRate"],
} as const;
/** Index cases and immune exclusions are disjoint; secondary cases are among remaining susceptible contacts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalExposed, indexCases, immuneExcluded, secondaryCases } = request;
  const compute = (): Output => {
    H.integer(totalExposed, 1);
    H.integer(indexCases, 0);
    H.integer(immuneExcluded, 0);
    H.domain(totalExposed > indexCases + immuneExcluded);
    H.integer(secondaryCases, 0, totalExposed - indexCases - immuneExcluded);
    return {
      susceptibleContacts: totalExposed - indexCases - immuneExcluded,
      secondaryAttackRate:
        secondaryCases / (totalExposed - indexCases - immuneExcluded),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalExposed: 50,
    indexCases: 2,
    immuneExcluded: 8,
    secondaryCases: 10,
  },
  output: { susceptibleContacts: 40, secondaryAttackRate: 0.25 },
} satisfies ToolExample<Input, Output>;
export const secondaryAttackRateIndexExclusionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/secondary-attack-rate-index-exclusion",
    title: "Secondary Attack Rate Index Exclusion Tool",
    description:
      "Index cases and immune exclusions are disjoint; secondary cases are among remaining susceptible contacts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalExposed: { type: "integer", minimum: 1 },
        indexCases: { type: "integer", minimum: 0 },
        immuneExcluded: { type: "integer", minimum: 0 },
        secondaryCases: { type: "integer", minimum: 0 },
      },
      required: [
        "totalExposed",
        "indexCases",
        "immuneExcluded",
        "secondaryCases",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        susceptibleContacts: { type: "integer" },
        secondaryAttackRate: { type: "number" },
      },
      required: ["susceptibleContacts", "secondaryAttackRate"],
    },
    ports: {
      inputs: [
        {
          id: "totalExposed",
          label: "Total Exposed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "indexCases",
          label: "Index Cases",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "immuneExcluded",
          label: "Immune Excluded",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondaryCases",
          label: "Secondary Cases",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "susceptibleContacts",
          label: "Susceptible Contacts",
          valueType: { type: "integer" },
        },
        {
          id: "secondaryAttackRate",
          label: "Secondary Attack Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = secondaryAttackRateIndexExclusionTool.execute;
export default secondaryAttackRateIndexExclusionTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly residentResident: number;
  readonly mutantResident: number;
  readonly residentMutant: number;
  readonly mutantMutant: number;
};
export type Output = {
  readonly primaryGap: number;
  readonly secondaryGap: number;
  readonly satisfiesPairCondition: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residentResident: { type: "number" },
    mutantResident: { type: "number" },
    residentMutant: { type: "number" },
    mutantMutant: { type: "number" },
  },
  required: [
    "residentResident",
    "mutantResident",
    "residentMutant",
    "mutantMutant",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    primaryGap: { type: "number" },
    secondaryGap: { type: "number" },
    satisfiesPairCondition: { type: "boolean" },
  },
  required: ["primaryGap", "secondaryGap", "satisfiesPairCondition"],
} as const;
/** Check the two ESS inequalities against one specified mutant, not against all possible mutant strategies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { residentResident, mutantResident, residentMutant, mutantMutant } =
    request;
  const compute = (): Output => {
    return {
      primaryGap: residentResident - mutantResident,
      secondaryGap: residentMutant - mutantMutant,
      satisfiesPairCondition:
        residentResident > mutantResident ||
        (residentResident === mutantResident && residentMutant > mutantMutant),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    residentResident: 3,
    mutantResident: 3,
    residentMutant: 2,
    mutantMutant: 1,
  },
  output: { primaryGap: 0, secondaryGap: 1, satisfiesPairCondition: true },
} satisfies ToolExample<Input, Output>;
export const evolutionaryStabilityOneMutantPayoffGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "game-theory/evolutionary-stability-one-mutant-payoff-gap",
      title: "Evolutionary Stability One Mutant Payoff Gap Tool",
      description:
        "Check the two ESS inequalities against one specified mutant, not against all possible mutant strategies.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          residentResident: { type: "number" },
          mutantResident: { type: "number" },
          residentMutant: { type: "number" },
          mutantMutant: { type: "number" },
        },
        required: [
          "residentResident",
          "mutantResident",
          "residentMutant",
          "mutantMutant",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          primaryGap: { type: "number" },
          secondaryGap: { type: "number" },
          satisfiesPairCondition: { type: "boolean" },
        },
        required: ["primaryGap", "secondaryGap", "satisfiesPairCondition"],
      },
      ports: {
        inputs: [
          {
            id: "residentResident",
            label: "Resident Resident",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "mutantResident",
            label: "Mutant Resident",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "residentMutant",
            label: "Resident Mutant",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "mutantMutant",
            label: "Mutant Mutant",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "primaryGap",
            label: "Primary Gap",
            valueType: { type: "number" },
          },
          {
            id: "secondaryGap",
            label: "Secondary Gap",
            valueType: { type: "number" },
          },
          {
            id: "satisfiesPairCondition",
            label: "Satisfies Pair Condition",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = evolutionaryStabilityOneMutantPayoffGapTool.execute;
export default evolutionaryStabilityOneMutantPayoffGapTool;

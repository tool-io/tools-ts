import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plantedCount: number;
  readonly assessedCount: number;
  readonly survivorsAmongAssessed: number;
};
export type Output = {
  readonly assessedSurvivalFraction: number;
  readonly unassessedCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plantedCount: { type: "integer", minimum: 1 },
    assessedCount: { type: "integer", minimum: 1 },
    survivorsAmongAssessed: { type: "integer", minimum: 0 },
  },
  required: ["plantedCount", "assessedCount", "survivorsAmongAssessed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assessedSurvivalFraction: { type: "number" },
    unassessedCount: { type: "integer" },
  },
  required: ["assessedSurvivalFraction", "unassessedCount"],
} as const;
/** Describe restoration survival only among explicitly assessed plantings while keeping unassessed plantings separate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plantedCount, assessedCount, survivorsAmongAssessed } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(plantedCount) &&
        plantedCount >= 1 &&
        plantedCount <= Number.MAX_SAFE_INTEGER,
      "plantedCount",
    ),
      plantedCount);
    (H.domain(
      Number.isSafeInteger(assessedCount) &&
        assessedCount >= 1 &&
        assessedCount <= plantedCount,
      "assessedCount",
    ),
      assessedCount);
    (H.domain(
      Number.isSafeInteger(survivorsAmongAssessed) &&
        survivorsAmongAssessed >= 0 &&
        survivorsAmongAssessed <= assessedCount,
      "survivorsAmongAssessed",
    ),
      survivorsAmongAssessed);
    return {
      assessedSurvivalFraction: survivorsAmongAssessed / assessedCount,
      unassessedCount: plantedCount - assessedCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plantedCount: 100, assessedCount: 80, survivorsAmongAssessed: 60 },
  output: { assessedSurvivalFraction: 0.75, unassessedCount: 20 },
} satisfies ToolExample<Input, Output>;
export const restorationSurvivorCountDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["conservation-biology", "conservation biology", "biology"],
        keywords: ["conservation biology", "biology"],
      },
      id: "conservation-biology/restoration-survivor-count-denominator",
      title: "Restoration Survivor Count Denominator",
      description:
        "Describe restoration survival only among explicitly assessed plantings while keeping unassessed plantings separate.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          plantedCount: { type: "integer", minimum: 1 },
          assessedCount: { type: "integer", minimum: 1 },
          survivorsAmongAssessed: { type: "integer", minimum: 0 },
        },
        required: ["plantedCount", "assessedCount", "survivorsAmongAssessed"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          assessedSurvivalFraction: { type: "number" },
          unassessedCount: { type: "integer" },
        },
        required: ["assessedSurvivalFraction", "unassessedCount"],
      },
      ports: {
        inputs: [
          {
            id: "plantedCount",
            label: "Planted Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "assessedCount",
            label: "Assessed Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "survivorsAmongAssessed",
            label: "Survivors Among Assessed",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "assessedSurvivalFraction",
            label: "Assessed Survival Fraction",
            valueType: { type: "number" },
          },
          {
            id: "unassessedCount",
            label: "Unassessed Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = restorationSurvivorCountDenominatorTool.execute;
export default restorationSurvivorCountDenominatorTool;

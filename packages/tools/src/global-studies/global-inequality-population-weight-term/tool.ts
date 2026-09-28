import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly groupPopulation: number;
  readonly totalPopulation: number;
  readonly groupMeanIncome: number;
  readonly globalMeanIncome: number;
};
export type Output = {
  readonly populationWeight: number;
  readonly incomeShare: number;
  readonly betweenGroupTheilTerm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupPopulation: { type: "number", minimum: 0 },
    totalPopulation: { type: "number", exclusiveMinimum: 0 },
    groupMeanIncome: { type: "number", minimum: 0 },
    globalMeanIncome: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "groupPopulation",
    "totalPopulation",
    "groupMeanIncome",
    "globalMeanIncome",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    populationWeight: { type: "number" },
    incomeShare: { type: "number" },
    betweenGroupTheilTerm: { type: "number" },
  },
  required: ["populationWeight", "incomeShare", "betweenGroupTheilTerm"],
} as const;
/** One population-weighted between-group Theil T contribution, using the zero-income continuous limit and an externally supplied global mean. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    groupPopulation,
    totalPopulation,
    groupMeanIncome,
    globalMeanIncome,
  } = request;
  const compute = (): Output => {
    H.positive(totalPopulation);
    H.positive(globalMeanIncome);
    H.domain(
      groupPopulation >= 0 &&
        groupPopulation <= totalPopulation &&
        groupMeanIncome >= 0,
    );
    return {
      populationWeight: groupPopulation / totalPopulation,
      incomeShare:
        (groupPopulation * groupMeanIncome) /
        (totalPopulation * globalMeanIncome),
      betweenGroupTheilTerm:
        groupMeanIncome === 0
          ? 0
          : ((groupPopulation * groupMeanIncome) /
              (totalPopulation * globalMeanIncome)) *
            Math.log(groupMeanIncome / globalMeanIncome),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    groupPopulation: 100,
    totalPopulation: 1000,
    groupMeanIncome: 2000,
    globalMeanIncome: 1000,
  },
  output: {
    populationWeight: 0.1,
    incomeShare: 0.2,
    betweenGroupTheilTerm: 0.13862943611198905,
  },
} satisfies ToolExample<Input, Output>;
export const globalInequalityPopulationWeightTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "global-studies/global-inequality-population-weight-term",
      title: "Global Inequality Population Weight Term Tool",
      description:
        "One population-weighted between-group Theil T contribution, using the zero-income continuous limit and an externally supplied global mean.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          groupPopulation: { type: "number", minimum: 0 },
          totalPopulation: { type: "number", exclusiveMinimum: 0 },
          groupMeanIncome: { type: "number", minimum: 0 },
          globalMeanIncome: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "groupPopulation",
          "totalPopulation",
          "groupMeanIncome",
          "globalMeanIncome",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          populationWeight: { type: "number" },
          incomeShare: { type: "number" },
          betweenGroupTheilTerm: { type: "number" },
        },
        required: ["populationWeight", "incomeShare", "betweenGroupTheilTerm"],
      },
      ports: {
        inputs: [
          {
            id: "groupPopulation",
            label: "Group Population",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalPopulation",
            label: "Total Population",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "groupMeanIncome",
            label: "Group Mean Income",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "globalMeanIncome",
            label: "Global Mean Income",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "populationWeight",
            label: "Population Weight",
            valueType: { type: "number" },
          },
          {
            id: "incomeShare",
            label: "Income Share",
            valueType: { type: "number" },
          },
          {
            id: "betweenGroupTheilTerm",
            label: "Between Group Theil Term",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = globalInequalityPopulationWeightTermTool.execute;
export default globalInequalityPopulationWeightTermTool;

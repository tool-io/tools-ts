import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly groupPopulation: number;
  readonly totalPopulation: number;
  readonly groupFiscalCost: number;
};
export type Output = {
  readonly share: number;
  readonly weightedPerCapitaCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupPopulation: { type: "number", minimum: 0 },
    totalPopulation: { type: "number", exclusiveMinimum: 0 },
    groupFiscalCost: { type: "number" },
  },
  required: ["groupPopulation", "totalPopulation", "groupFiscalCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    share: { type: "number" },
    weightedPerCapitaCost: { type: "number" },
  },
  required: ["share", "weightedPerCapitaCost"],
} as const;
/** Calculate population ageing one group weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { groupPopulation, totalPopulation, groupFiscalCost } = request;
  const compute = (): Output => {
    H.positive(totalPopulation);
    H.domain(groupPopulation >= 0 && groupPopulation <= totalPopulation);
    return {
      share: groupPopulation / totalPopulation,
      weightedPerCapitaCost:
        (groupPopulation * groupFiscalCost) / totalPopulation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { groupPopulation: 20, totalPopulation: 100, groupFiscalCost: 500 },
  output: { share: 0.2, weightedPerCapitaCost: 100 },
} satisfies ToolExample<Input, Output>;
export const populationAgeingOneGroupWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/population-ageing-one-group-weight",
    title: "Population Ageing One Group Weight Tool",
    description:
      "Calculate population ageing one group weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupPopulation: { type: "number", minimum: 0 },
        totalPopulation: { type: "number", exclusiveMinimum: 0 },
        groupFiscalCost: { type: "number" },
      },
      required: ["groupPopulation", "totalPopulation", "groupFiscalCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        share: { type: "number" },
        weightedPerCapitaCost: { type: "number" },
      },
      required: ["share", "weightedPerCapitaCost"],
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
          id: "groupFiscalCost",
          label: "Group Fiscal Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        {
          id: "weightedPerCapitaCost",
          label: "Weighted Per Capita Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = populationAgeingOneGroupWeightTool.execute;
export default populationAgeingOneGroupWeightTool;

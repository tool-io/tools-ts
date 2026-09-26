import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baselineEmissions: number;
  readonly projectEmissions: number;
  readonly baselineCost: number;
  readonly projectCost: number;
};
export type Output = {
  readonly abatement: number;
  readonly incrementalCost: number;
  readonly costPerAvoidedTonne: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineEmissions: { type: "number" },
    projectEmissions: { type: "number", minimum: 0 },
    baselineCost: { type: "number" },
    projectCost: { type: "number" },
  },
  required: [
    "baselineEmissions",
    "projectEmissions",
    "baselineCost",
    "projectCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    abatement: { type: "number" },
    incrementalCost: { type: "number" },
    costPerAvoidedTonne: { type: "number" },
  },
  required: ["abatement", "incrementalCost", "costPerAvoidedTonne"],
} as const;
/** Incremental cost per avoided tonne for a specified project step, using matched costs and emissions boundaries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baselineEmissions, projectEmissions, baselineCost, projectCost } =
    request;
  const compute = (): Output => {
    H.domain(baselineEmissions > projectEmissions && projectEmissions >= 0);
    return {
      abatement: baselineEmissions - projectEmissions,
      incrementalCost: projectCost - baselineCost,
      costPerAvoidedTonne:
        (projectCost - baselineCost) / (baselineEmissions - projectEmissions),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baselineEmissions: 1000,
    projectEmissions: 800,
    baselineCost: 10000,
    projectCost: 14000,
  },
  output: { abatement: 200, incrementalCost: 4000, costPerAvoidedTonne: 20 },
} satisfies ToolExample<Input, Output>;
export const carbonAbatementMarginalCostOneStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/carbon-abatement-marginal-cost-one-step",
    title: "Carbon Abatement Marginal Cost One Step Tool",
    description:
      "Incremental cost per avoided tonne for a specified project step, using matched costs and emissions boundaries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baselineEmissions: { type: "number" },
        projectEmissions: { type: "number", minimum: 0 },
        baselineCost: { type: "number" },
        projectCost: { type: "number" },
      },
      required: [
        "baselineEmissions",
        "projectEmissions",
        "baselineCost",
        "projectCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        abatement: { type: "number" },
        incrementalCost: { type: "number" },
        costPerAvoidedTonne: { type: "number" },
      },
      required: ["abatement", "incrementalCost", "costPerAvoidedTonne"],
    },
    ports: {
      inputs: [
        {
          id: "baselineEmissions",
          label: "Baseline Emissions",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "projectEmissions",
          label: "Project Emissions",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baselineCost",
          label: "Baseline Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "projectCost",
          label: "Project Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "abatement", label: "Abatement", valueType: { type: "number" } },
        {
          id: "incrementalCost",
          label: "Incremental Cost",
          valueType: { type: "number" },
        },
        {
          id: "costPerAvoidedTonne",
          label: "Cost Per Avoided Tonne",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = carbonAbatementMarginalCostOneStepTool.execute;
export default carbonAbatementMarginalCostOneStepTool;

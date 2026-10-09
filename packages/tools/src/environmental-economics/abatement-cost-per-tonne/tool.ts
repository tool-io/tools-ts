import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly incrementalCost: number;
  readonly baselineEmissionsTonnes: number;
  readonly projectEmissionsTonnes: number;
};
export type Output = {
  readonly avoidedTonnes: number;
  readonly costPerAvoidedTonne: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incrementalCost: { type: "number" },
    baselineEmissionsTonnes: { type: "number", minimum: 0 },
    projectEmissionsTonnes: { type: "number", minimum: 0 },
  },
  required: [
    "incrementalCost",
    "baselineEmissionsTonnes",
    "projectEmissionsTonnes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    avoidedTonnes: { type: "number" },
    costPerAvoidedTonne: { type: "number" },
  },
  required: ["avoidedTonnes", "costPerAvoidedTonne"],
} as const;
/** Divide explicit incremental cost by positive avoided emissions in tonnes, retaining negative cost savings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { incrementalCost, baselineEmissionsTonnes, projectEmissionsTonnes } =
    request;
  const compute = (): Output => {
    H.domain(
      baselineEmissionsTonnes >= 0 &&
        projectEmissionsTonnes >= 0 &&
        baselineEmissionsTonnes > projectEmissionsTonnes,
      "baselineEmissionsTonnes",
    );
    return {
      avoidedTonnes: baselineEmissionsTonnes - projectEmissionsTonnes,
      costPerAvoidedTonne:
        incrementalCost / (baselineEmissionsTonnes - projectEmissionsTonnes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    incrementalCost: 900,
    baselineEmissionsTonnes: 120,
    projectEmissionsTonnes: 100,
  },
  output: { avoidedTonnes: 20, costPerAvoidedTonne: 45 },
} satisfies ToolExample<Input, Output>;
export const abatementCostPerTonneTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "environmental-economics",
        "environmental economics",
        "economics",
      ],
      keywords: ["environmental economics", "economics"],
    },
    id: "environmental-economics/abatement-cost-per-tonne",
    title: "Abatement Cost Per Tonne",
    description:
      "Divide explicit incremental cost by positive avoided emissions in tonnes, retaining negative cost savings.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        incrementalCost: { type: "number" },
        baselineEmissionsTonnes: { type: "number", minimum: 0 },
        projectEmissionsTonnes: { type: "number", minimum: 0 },
      },
      required: [
        "incrementalCost",
        "baselineEmissionsTonnes",
        "projectEmissionsTonnes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        avoidedTonnes: { type: "number" },
        costPerAvoidedTonne: { type: "number" },
      },
      required: ["avoidedTonnes", "costPerAvoidedTonne"],
    },
    ports: {
      inputs: [
        {
          id: "incrementalCost",
          label: "Incremental Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baselineEmissionsTonnes",
          label: "Baseline Emissions Tonnes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "projectEmissionsTonnes",
          label: "Project Emissions Tonnes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "avoidedTonnes",
          label: "Avoided Tonnes",
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
export const run = abatementCostPerTonneTool.execute;
export default abatementCostPerTonneTool;

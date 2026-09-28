import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligiblePeople: number;
  readonly uptakeFraction: number;
  readonly incrementalTreatmentCost: number;
  readonly implementationCost: number;
  readonly displacedCost: number;
};
export type Output = {
  readonly treatedPeople: number;
  readonly grossIncrementalCost: number;
  readonly netBudgetImpact: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligiblePeople: { type: "integer", minimum: 0 },
    uptakeFraction: { type: "number", minimum: 0, maximum: 1 },
    incrementalTreatmentCost: { type: "number" },
    implementationCost: { type: "number" },
    displacedCost: { type: "number" },
  },
  required: [
    "eligiblePeople",
    "uptakeFraction",
    "incrementalTreatmentCost",
    "implementationCost",
    "displacedCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    treatedPeople: { type: "number" },
    grossIncrementalCost: { type: "number" },
    netBudgetImpact: { type: "number" },
  },
  required: ["treatedPeople", "grossIncrementalCost", "netBudgetImpact"],
} as const;
/** One-year expected uptake and budget impact; costs must use matched scope and displaced costs must not already be netted out. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    eligiblePeople,
    uptakeFraction,
    incrementalTreatmentCost,
    implementationCost,
    displacedCost,
  } = request;
  const compute = (): Output => {
    H.integer(eligiblePeople, 0);
    H.probability(uptakeFraction);
    return {
      treatedPeople: eligiblePeople * uptakeFraction,
      grossIncrementalCost:
        eligiblePeople * uptakeFraction * incrementalTreatmentCost +
        implementationCost,
      netBudgetImpact:
        eligiblePeople * uptakeFraction * incrementalTreatmentCost +
        implementationCost -
        displacedCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligiblePeople: 1000,
    uptakeFraction: 0.2,
    incrementalTreatmentCost: 500,
    implementationCost: 20000,
    displacedCost: 30000,
  },
  output: {
    treatedPeople: 200,
    grossIncrementalCost: 120000,
    netBudgetImpact: 90000,
  },
} satisfies ToolExample<Input, Output>;
export const healthEconomicBudgetImpactOneYearTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-economics/health-economic-budget-impact-one-year-term",
      title: "Health Economic Budget Impact One Year Term Tool",
      description:
        "One-year expected uptake and budget impact; costs must use matched scope and displaced costs must not already be netted out.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligiblePeople: { type: "integer", minimum: 0 },
          uptakeFraction: { type: "number", minimum: 0, maximum: 1 },
          incrementalTreatmentCost: { type: "number" },
          implementationCost: { type: "number" },
          displacedCost: { type: "number" },
        },
        required: [
          "eligiblePeople",
          "uptakeFraction",
          "incrementalTreatmentCost",
          "implementationCost",
          "displacedCost",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          treatedPeople: { type: "number" },
          grossIncrementalCost: { type: "number" },
          netBudgetImpact: { type: "number" },
        },
        required: ["treatedPeople", "grossIncrementalCost", "netBudgetImpact"],
      },
      ports: {
        inputs: [
          {
            id: "eligiblePeople",
            label: "Eligible People",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "uptakeFraction",
            label: "Uptake Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "incrementalTreatmentCost",
            label: "Incremental Treatment Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "implementationCost",
            label: "Implementation Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "displacedCost",
            label: "Displaced Cost",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "treatedPeople",
            label: "Treated People",
            valueType: { type: "number" },
          },
          {
            id: "grossIncrementalCost",
            label: "Gross Incremental Cost",
            valueType: { type: "number" },
          },
          {
            id: "netBudgetImpact",
            label: "Net Budget Impact",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthEconomicBudgetImpactOneYearTermTool.execute;
export default healthEconomicBudgetImpactOneYearTermTool;

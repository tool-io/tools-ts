import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capital: number;
  readonly training: number;
  readonly lostIncome: number;
  readonly grant: number;
  readonly years: number;
};
export type Output = {
  readonly netCost: number;
  readonly annualizedStraightLine: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capital: { type: "number", minimum: 0 },
    training: { type: "number", minimum: 0 },
    lostIncome: { type: "number", minimum: 0 },
    grant: { type: "number", minimum: 0 },
    years: { type: "integer", minimum: 1 },
  },
  required: ["capital", "training", "lostIncome", "grant", "years"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netCost: { type: "number" },
    annualizedStraightLine: { type: "number" },
  },
  required: ["netCost", "annualizedStraightLine"],
} as const;
/** Calculate regenerative practice transition cost share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capital, training, lostIncome, grant, years } = request;
  const compute = (): Output => {
    H.integer(years, 1);
    H.domain(capital >= 0 && training >= 0 && lostIncome >= 0 && grant >= 0);
    return {
      netCost: capital + training + lostIncome - grant,
      annualizedStraightLine: (capital + training + lostIncome - grant) / years,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    capital: 1000,
    training: 200,
    lostIncome: 300,
    grant: 500,
    years: 5,
  },
  output: { netCost: 1000, annualizedStraightLine: 200 },
} satisfies ToolExample<Input, Output>;
export const regenerativePracticeTransitionCostShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "sustainable-agriculture/regenerative-practice-transition-cost-share",
      title: "Regenerative Practice Transition Cost Share Tool",
      description:
        "Calculate regenerative practice transition cost share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          capital: { type: "number", minimum: 0 },
          training: { type: "number", minimum: 0 },
          lostIncome: { type: "number", minimum: 0 },
          grant: { type: "number", minimum: 0 },
          years: { type: "integer", minimum: 1 },
        },
        required: ["capital", "training", "lostIncome", "grant", "years"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netCost: { type: "number" },
          annualizedStraightLine: { type: "number" },
        },
        required: ["netCost", "annualizedStraightLine"],
      },
      ports: {
        inputs: [
          {
            id: "capital",
            label: "Capital",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "training",
            label: "Training",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lostIncome",
            label: "Lost Income",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "grant",
            label: "Grant",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "years",
            label: "Years",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "netCost", label: "Net Cost", valueType: { type: "number" } },
          {
            id: "annualizedStraightLine",
            label: "Annualized Straight Line",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = regenerativePracticeTransitionCostShareTool.execute;
export default regenerativePracticeTransitionCostShareTool;

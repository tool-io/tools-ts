import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstMarginalRate: number;
  readonly secondMarginalRate: number;
  readonly suppliedTaxWedge: number;
};
export type Output = {
  readonly observedWedge: number;
  readonly unexplainedWedge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMarginalRate: { type: "number" },
    secondMarginalRate: { type: "number" },
    suppliedTaxWedge: { type: "number" },
  },
  required: ["firstMarginalRate", "secondMarginalRate", "suppliedTaxWedge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedWedge: { type: "number" },
    unexplainedWedge: { type: "number" },
  },
  required: ["observedWedge", "unexplainedWedge"],
} as const;
/** Compare supplied marginal rates in a common basis without deriving tax rules or equilibrium conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstMarginalRate, secondMarginalRate, suppliedTaxWedge } = request;
  const compute = (): Output => {
    return {
      observedWedge: firstMarginalRate - secondMarginalRate,
      unexplainedWedge:
        firstMarginalRate - secondMarginalRate - suppliedTaxWedge,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstMarginalRate: 3, secondMarginalRate: 2, suppliedTaxWedge: 0.5 },
  output: { observedWedge: 1, unexplainedWedge: 0.5 },
} satisfies ToolExample<Input, Output>;
export const marginalRateWedgeTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "economics/marginal-rate-wedge",
    title: "Marginal Rate Wedge Tool",
    description:
      "Compare supplied marginal rates in a common basis without deriving tax rules or equilibrium conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstMarginalRate: { type: "number" },
        secondMarginalRate: { type: "number" },
        suppliedTaxWedge: { type: "number" },
      },
      required: ["firstMarginalRate", "secondMarginalRate", "suppliedTaxWedge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedWedge: { type: "number" },
        unexplainedWedge: { type: "number" },
      },
      required: ["observedWedge", "unexplainedWedge"],
    },
    ports: {
      inputs: [
        {
          id: "firstMarginalRate",
          label: "First Marginal Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondMarginalRate",
          label: "Second Marginal Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTaxWedge",
          label: "Supplied Tax Wedge",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observedWedge",
          label: "Observed Wedge",
          valueType: { type: "number" },
        },
        {
          id: "unexplainedWedge",
          label: "Unexplained Wedge",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = marginalRateWedgeTool.execute;
export default marginalRateWedgeTool;

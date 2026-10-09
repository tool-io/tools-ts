import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly portfolioFactorExposure: number;
  readonly hedgeExposurePerUnit: number;
};
export type Output = { readonly requiredHedgeUnits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    portfolioFactorExposure: { type: "number" },
    hedgeExposurePerUnit: { type: "number" },
  },
  required: ["portfolioFactorExposure", "hedgeExposurePerUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { requiredHedgeUnits: { type: "number" } },
  required: ["requiredHedgeUnits"],
} as const;
/** Solve one scalar factor-neutral hedge quantity from explicit portfolio and nonzero per-unit hedge exposure without asserting multidimensional neutrality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { portfolioFactorExposure, hedgeExposurePerUnit } = request;
  const compute = (): Output => {
    H.domain(hedgeExposurePerUnit !== 0, "hedgeExposurePerUnit");
    return {
      requiredHedgeUnits: -portfolioFactorExposure / hedgeExposurePerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { portfolioFactorExposure: 120, hedgeExposurePerUnit: 3 },
  output: { requiredHedgeUnits: -40 },
} satisfies ToolExample<Input, Output>;
export const factorNeutralHedgeExposureTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/factor-neutral-hedge-exposure-term",
    title: "Factor Neutral Hedge Exposure Term Tool",
    description:
      "Solve one scalar factor-neutral hedge quantity from explicit portfolio and nonzero per-unit hedge exposure without asserting multidimensional neutrality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        portfolioFactorExposure: { type: "number" },
        hedgeExposurePerUnit: { type: "number" },
      },
      required: ["portfolioFactorExposure", "hedgeExposurePerUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { requiredHedgeUnits: { type: "number" } },
      required: ["requiredHedgeUnits"],
    },
    ports: {
      inputs: [
        {
          id: "portfolioFactorExposure",
          label: "Portfolio Factor Exposure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hedgeExposurePerUnit",
          label: "Hedge Exposure Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredHedgeUnits",
          label: "Required Hedge Units",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = factorNeutralHedgeExposureTermTool.execute;
export default factorNeutralHedgeExposureTermTool;

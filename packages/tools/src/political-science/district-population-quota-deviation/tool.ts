import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly population: number; readonly quota: number };
export type Output = {
  readonly deviation: number;
  readonly deviationPercent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    population: { type: "number", minimum: 0 },
    quota: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["population", "quota"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviation: { type: "number" },
    deviationPercent: { type: "number" },
  },
  required: ["deviation", "deviationPercent"],
} as const;
/** Compare district population with a positive supplied equal-population quota without assessing electoral legality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { population, quota } = request;
  const compute = (): Output => {
    H.domain(population >= 0, "population");
    (H.domain(quota > 0, "quota"), quota);
    return {
      deviation: population - quota,
      deviationPercent: (100 * (population - quota)) / quota,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { population: 105000, quota: 100000 },
  output: { deviation: 5000, deviationPercent: 5 },
} satisfies ToolExample<Input, Output>;
export const districtPopulationQuotaDeviationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/district-population-quota-deviation",
    title: "District Population Quota Deviation Tool",
    description:
      "Compare district population with a positive supplied equal-population quota without assessing electoral legality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        population: { type: "number", minimum: 0 },
        quota: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["population", "quota"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviation: { type: "number" },
        deviationPercent: { type: "number" },
      },
      required: ["deviation", "deviationPercent"],
    },
    ports: {
      inputs: [
        {
          id: "population",
          label: "Population",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quota",
          label: "Quota",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "deviation", label: "Deviation", valueType: { type: "number" } },
        {
          id: "deviationPercent",
          label: "Deviation Percent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = districtPopulationQuotaDeviationTool.execute;
export default districtPopulationQuotaDeviationTool;

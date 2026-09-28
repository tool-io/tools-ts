import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly eligible: number; readonly population: number };
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "integer", minimum: 0 },
    population: { type: "integer", minimum: 0 },
  },
  required: ["eligible", "population"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Compute a supplied eligible-person share without selecting eligibility criteria. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligible, population } = request;
  const compute = (): Output => {
    H.integer(population, 0);
    H.integer(eligible, 0, population);
    return {
      share: population > 0 ? eligible / population : 0,
      defined: population > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eligible: 80, population: 100 },
  output: { share: 0.8, defined: true },
} satisfies ToolExample<Input, Output>;
export const populationEligibleShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/population-eligible-share",
    title: "Population Eligible Share Tool",
    description:
      "Compute a supplied eligible-person share without selecting eligibility criteria.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligible: { type: "integer", minimum: 0 },
        population: { type: "integer", minimum: 0 },
      },
      required: ["eligible", "population"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "eligible",
          label: "Eligible",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "population",
          label: "Population",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = populationEligibleShareTool.execute;
export default populationEligibleShareTool;

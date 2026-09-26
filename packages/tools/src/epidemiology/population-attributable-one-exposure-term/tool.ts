import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exposurePrevalence: number;
  readonly relativeRisk: number;
};
export type Output = { readonly populationAttributableFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposurePrevalence: { type: "number", minimum: 0, maximum: 1 },
    relativeRisk: { type: "number", minimum: 0 },
  },
  required: ["exposurePrevalence", "relativeRisk"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { populationAttributableFraction: { type: "number" } },
  required: ["populationAttributableFraction"],
} as const;
/** Levin population attributable fraction under a single binary exposure and an applicable causal relative risk supplied externally. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exposurePrevalence, relativeRisk } = request;
  const compute = (): Output => {
    H.probability(exposurePrevalence);
    H.domain(
      relativeRisk >= 0 && 1 + exposurePrevalence * (relativeRisk - 1) > 0,
    );
    return {
      populationAttributableFraction:
        (exposurePrevalence * (relativeRisk - 1)) /
        (1 + exposurePrevalence * (relativeRisk - 1)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exposurePrevalence: 0.25, relativeRisk: 3 },
  output: { populationAttributableFraction: 0.3333333333333333 },
} satisfies ToolExample<Input, Output>;
export const populationAttributableOneExposureTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epidemiology/population-attributable-one-exposure-term",
      title: "Population Attributable One Exposure Term Tool",
      description:
        "Levin population attributable fraction under a single binary exposure and an applicable causal relative risk supplied externally.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          exposurePrevalence: { type: "number", minimum: 0, maximum: 1 },
          relativeRisk: { type: "number", minimum: 0 },
        },
        required: ["exposurePrevalence", "relativeRisk"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { populationAttributableFraction: { type: "number" } },
        required: ["populationAttributableFraction"],
      },
      ports: {
        inputs: [
          {
            id: "exposurePrevalence",
            label: "Exposure Prevalence",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "relativeRisk",
            label: "Relative Risk",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "populationAttributableFraction",
            label: "Population Attributable Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = populationAttributableOneExposureTermTool.execute;
export default populationAttributableOneExposureTermTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly population: number;
  readonly sample: number;
  readonly varianceOfMean: number;
};
export type Output = {
  readonly factor: number;
  readonly correctedVariance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    population: { type: "integer", minimum: 2 },
    sample: { type: "integer", minimum: 1 },
    varianceOfMean: { type: "number", minimum: 0 },
  },
  required: ["population", "sample", "varianceOfMean"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    factor: { type: "number" },
    correctedVariance: { type: "number" },
  },
  required: ["factor", "correctedVariance"],
} as const;
/** Calculate finite population variance sampling factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { population, sample, varianceOfMean } = request;
  const compute = (): Output => {
    H.integer(population, 2);
    H.integer(sample, 1, population);
    H.domain(varianceOfMean >= 0);
    const factor = (population - sample) / (population - 1);
    return { factor, correctedVariance: varianceOfMean * factor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { population: 101, sample: 21, varianceOfMean: 4 },
  output: { factor: 0.8, correctedVariance: 3.2 },
} satisfies ToolExample<Input, Output>;
export const finitePopulationVarianceSamplingFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "statistics/finite-population-variance-sampling-factor",
      title: "Finite Population Variance Sampling Factor Tool",
      description:
        "Calculate finite population variance sampling factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          population: { type: "integer", minimum: 2 },
          sample: { type: "integer", minimum: 1 },
          varianceOfMean: { type: "number", minimum: 0 },
        },
        required: ["population", "sample", "varianceOfMean"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          factor: { type: "number" },
          correctedVariance: { type: "number" },
        },
        required: ["factor", "correctedVariance"],
      },
      ports: {
        inputs: [
          {
            id: "population",
            label: "Population",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "sample",
            label: "Sample",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "varianceOfMean",
            label: "Variance Of Mean",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "factor", label: "Factor", valueType: { type: "number" } },
          {
            id: "correctedVariance",
            label: "Corrected Variance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = finitePopulationVarianceSamplingFactorTool.execute;
export default finitePopulationVarianceSamplingFactorTool;

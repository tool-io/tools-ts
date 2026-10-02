import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly outcome: number;
  readonly modelMass: number;
  readonly referenceMass: number;
};
export type Output = { readonly logRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outcome: { type: "integer", minimum: 0, maximum: 1 },
    modelMass: { type: "number" },
    referenceMass: { type: "number" },
  },
  required: ["outcome", "modelMass", "referenceMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logRatio: { type: "number" } },
  required: ["logRatio"],
} as const;
/** Compute binary observation log likelihood ratio term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { outcome, modelMass, referenceMass } = input;
  const compute = (): Output => {
    integer(outcome, 0, 1);
    domain(
      modelMass > 0 && modelMass < 1 && referenceMass > 0 && referenceMass < 1,
    );
    return {
      logRatio: outcome
        ? Math.log(modelMass / referenceMass)
        : Math.log((1 - modelMass) / (1 - referenceMass)),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { outcome: 1, modelMass: 0.5, referenceMass: 0.25 },
  output: { logRatio: 0.6931471805599453 },
} satisfies ToolExample<Input, Output>;
export const binaryObservationLogLikelihoodRatioTermTool =
  defineSchemaCalculation<Input, Output>({
    id: "probability/binary-observation-log-likelihood-ratio-term",
    title: "Binary Observation Log Likelihood Ratio Term Tool",
    description:
      "Compute binary observation log likelihood ratio term from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "outcome",
          label: "Outcome",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "modelMass",
          label: "Model Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceMass",
          label: "Reference Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "logRatio", label: "Log Ratio", valueType: { type: "number" } },
      ],
    },
  });
export const run = binaryObservationLogLikelihoodRatioTermTool.execute;
export default binaryObservationLogLikelihoodRatioTermTool;

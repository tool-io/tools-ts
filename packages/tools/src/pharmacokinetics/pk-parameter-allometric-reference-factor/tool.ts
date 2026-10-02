import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parameter: number;
  readonly bodyMass: number;
  readonly referenceMass: number;
  readonly exponent: number;
};
export type Output = {
  readonly massRatio: number;
  readonly scaledParameter: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parameter: { type: "number", minimum: 0 },
    bodyMass: { type: "number", exclusiveMinimum: 0 },
    referenceMass: { type: "number", exclusiveMinimum: 0 },
    exponent: { type: "number" },
  },
  required: ["parameter", "bodyMass", "referenceMass", "exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massRatio: { type: "number" },
    scaledParameter: { type: "number" },
  },
  required: ["massRatio", "scaledParameter"],
} as const;
/** Caller-calibrated research parameter scaling, without selecting an individual regimen. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parameter, bodyMass, referenceMass, exponent } = request;
  const compute = (): Output => {
    H.domain(parameter >= 0);
    H.positive(bodyMass);
    H.positive(referenceMass);
    return {
      massRatio: bodyMass / referenceMass,
      scaledParameter: parameter * (bodyMass / referenceMass) ** exponent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parameter: 10, bodyMass: 80, referenceMass: 20, exponent: 0.75 },
  output: { massRatio: 4, scaledParameter: 28.284271247461902 },
} satisfies ToolExample<Input, Output>;
export const pkParameterAllometricReferenceFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacokinetics/pk-parameter-allometric-reference-factor",
      title: "PK Parameter Allometric Reference Factor Tool",
      description:
        "Caller-calibrated research parameter scaling, without selecting an individual regimen.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parameter: { type: "number", minimum: 0 },
          bodyMass: { type: "number", exclusiveMinimum: 0 },
          referenceMass: { type: "number", exclusiveMinimum: 0 },
          exponent: { type: "number" },
        },
        required: ["parameter", "bodyMass", "referenceMass", "exponent"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          massRatio: { type: "number" },
          scaledParameter: { type: "number" },
        },
        required: ["massRatio", "scaledParameter"],
      },
      ports: {
        inputs: [
          {
            id: "parameter",
            label: "Parameter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "bodyMass",
            label: "Body Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceMass",
            label: "Reference Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exponent",
            label: "Exponent",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "massRatio",
            label: "Mass Ratio",
            valueType: { type: "number" },
          },
          {
            id: "scaledParameter",
            label: "Scaled Parameter",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pkParameterAllometricReferenceFactorTool.execute;
export default pkParameterAllometricReferenceFactorTool;

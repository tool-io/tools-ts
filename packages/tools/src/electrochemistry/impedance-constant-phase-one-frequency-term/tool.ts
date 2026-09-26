import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly admittanceCoefficient: number;
  readonly angularFrequency: number;
  readonly exponent: number;
};
export type Output = {
  readonly real: number;
  readonly imaginary: number;
  readonly magnitude: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    admittanceCoefficient: { type: "number", exclusiveMinimum: 0 },
    angularFrequency: { type: "number", exclusiveMinimum: 0 },
    exponent: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["admittanceCoefficient", "angularFrequency", "exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    real: { type: "number" },
    imaginary: { type: "number" },
    magnitude: { type: "number" },
  },
  required: ["real", "imaginary", "magnitude"],
} as const;
/** Z=1/[Q(j omega)^alpha] under the exp(+j omega t) convention; Q has exponent-dependent units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { admittanceCoefficient, angularFrequency, exponent } = request;
  const compute = (): Output => {
    H.positive(admittanceCoefficient);
    H.positive(angularFrequency);
    H.probability(exponent);
    return {
      real:
        Math.cos((Math.PI * exponent) / 2) /
        (admittanceCoefficient * angularFrequency ** exponent),
      imaginary:
        -Math.sin((Math.PI * exponent) / 2) /
        (admittanceCoefficient * angularFrequency ** exponent),
      magnitude: 1 / (admittanceCoefficient * angularFrequency ** exponent),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { admittanceCoefficient: 2, angularFrequency: 4, exponent: 0 },
  output: { real: 0.5, imaginary: 0, magnitude: 0.5 },
} satisfies ToolExample<Input, Output>;
export const impedanceConstantPhaseOneFrequencyTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electrochemistry/impedance-constant-phase-one-frequency-term",
      title: "Impedance Constant Phase One Frequency Term Tool",
      description:
        "Z=1/[Q(j omega)^alpha] under the exp(+j omega t) convention; Q has exponent-dependent units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          admittanceCoefficient: { type: "number", exclusiveMinimum: 0 },
          angularFrequency: { type: "number", exclusiveMinimum: 0 },
          exponent: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["admittanceCoefficient", "angularFrequency", "exponent"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          real: { type: "number" },
          imaginary: { type: "number" },
          magnitude: { type: "number" },
        },
        required: ["real", "imaginary", "magnitude"],
      },
      ports: {
        inputs: [
          {
            id: "admittanceCoefficient",
            label: "Admittance Coefficient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "angularFrequency",
            label: "Angular Frequency",
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
          { id: "real", label: "Real", valueType: { type: "number" } },
          {
            id: "imaginary",
            label: "Imaginary",
            valueType: { type: "number" },
          },
          {
            id: "magnitude",
            label: "Magnitude",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = impedanceConstantPhaseOneFrequencyTermTool.execute;
export default impedanceConstantPhaseOneFrequencyTermTool;

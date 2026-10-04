import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly predatorLength: number;
  readonly preyLength: number;
  readonly predatorMass: number;
  readonly preyMass: number;
};
export type Output = {
  readonly lengthRatio: number;
  readonly massRatio: number;
  readonly preyMassFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predatorLength: { type: "number", exclusiveMinimum: 0 },
    preyLength: { type: "number", exclusiveMinimum: 0 },
    predatorMass: { type: "number", exclusiveMinimum: 0 },
    preyMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["predatorLength", "preyLength", "predatorMass", "preyMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengthRatio: { type: "number" },
    massRatio: { type: "number" },
    preyMassFraction: { type: "number" },
  },
  required: ["lengthRatio", "massRatio", "preyMassFraction"],
} as const;
/** Descriptive measured size ratios only, without inferring prey suitability or feeding recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { predatorLength, preyLength, predatorMass, preyMass } = request;
  const compute = (): Output => {
    H.positive(predatorLength);
    H.positive(preyLength);
    H.positive(predatorMass);
    H.positive(preyMass);
    return {
      lengthRatio: predatorLength / preyLength,
      massRatio: predatorMass / preyMass,
      preyMassFraction: preyMass / predatorMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    predatorLength: 100,
    preyLength: 20,
    predatorMass: 500,
    preyMass: 10,
  },
  output: { lengthRatio: 5, massRatio: 50, preyMassFraction: 0.02 },
} satisfies ToolExample<Input, Output>;
export const predatorPreySizeRatioTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/predator-prey-size-ratio-term",
    title: "Predator Prey Size Ratio Term Tool",
    description:
      "Descriptive measured size ratios only, without inferring prey suitability or feeding recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predatorLength: { type: "number", exclusiveMinimum: 0 },
        preyLength: { type: "number", exclusiveMinimum: 0 },
        predatorMass: { type: "number", exclusiveMinimum: 0 },
        preyMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["predatorLength", "preyLength", "predatorMass", "preyMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lengthRatio: { type: "number" },
        massRatio: { type: "number" },
        preyMassFraction: { type: "number" },
      },
      required: ["lengthRatio", "massRatio", "preyMassFraction"],
    },
    ports: {
      inputs: [
        {
          id: "predatorLength",
          label: "Predator Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "preyLength",
          label: "Prey Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predatorMass",
          label: "Predator Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "preyMass",
          label: "Prey Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lengthRatio",
          label: "Length Ratio",
          valueType: { type: "number" },
        },
        { id: "massRatio", label: "Mass Ratio", valueType: { type: "number" } },
        {
          id: "preyMassFraction",
          label: "Prey Mass Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = predatorPreySizeRatioTermTool.execute;
export default predatorPreySizeRatioTermTool;

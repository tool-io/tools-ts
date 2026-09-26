import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly conductance: number;
  readonly susceptance: number;
};
export type Output = {
  readonly magnitude: number;
  readonly capacitive: boolean;
  readonly inductive: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conductance: { type: "number", minimum: 0 },
    susceptance: { type: "number" },
  },
  required: ["conductance", "susceptance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    magnitude: { type: "number" },
    capacitive: { type: "boolean" },
    inductive: { type: "boolean" },
  },
  required: ["magnitude", "capacitive", "inductive"],
} as const;
/** Classify the susceptance sign of G+jB under the exp(+j*omega*t) admittance convention. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { conductance, susceptance } = input;
  const compute = (): Output => {
    H.domain(conductance >= 0);
    return {
      magnitude: Math.hypot(conductance, susceptance),
      capacitive: susceptance > 0,
      inductive: susceptance < 0,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { conductance: 3, susceptance: 4 },
  output: { magnitude: 5, capacitive: true, inductive: false },
} satisfies ToolExample<Input, Output>;
export const admittanceConductanceSusceptanceSignPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electricity/admittance-conductance-susceptance-sign-pair",
      title: "Admittance Conductance Susceptance Sign Pair Tool",
      description:
        "Classify the susceptance sign of G+jB under the exp(+j*omega*t) admittance convention.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conductance: { type: "number", minimum: 0 },
          susceptance: { type: "number" },
        },
        required: ["conductance", "susceptance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          magnitude: { type: "number" },
          capacitive: { type: "boolean" },
          inductive: { type: "boolean" },
        },
        required: ["magnitude", "capacitive", "inductive"],
      },
      ports: {
        inputs: [
          {
            id: "conductance",
            label: "Conductance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "susceptance",
            label: "Susceptance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "magnitude",
            label: "Magnitude",
            valueType: { type: "number" },
          },
          {
            id: "capacitive",
            label: "Capacitive",
            valueType: { type: "boolean" },
          },
          {
            id: "inductive",
            label: "Inductive",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = admittanceConductanceSusceptanceSignPairTool.execute;
export default admittanceConductanceSusceptanceSignPairTool;

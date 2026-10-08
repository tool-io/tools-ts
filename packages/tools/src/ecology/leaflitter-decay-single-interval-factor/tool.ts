import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialDryMass: number;
  readonly finalDryMass: number;
  readonly elapsedTime: number;
};
export type Output = {
  readonly remainingFraction: number;
  readonly apparentDecayConstant: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialDryMass: { type: "number", exclusiveMinimum: 0 },
    finalDryMass: { type: "number", exclusiveMinimum: 0 },
    elapsedTime: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["initialDryMass", "finalDryMass", "elapsedTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingFraction: { type: "number" },
    apparentDecayConstant: { type: "number" },
  },
  required: ["remainingFraction", "apparentDecayConstant"],
} as const;
/** Calculate a supplied litter dry-mass remaining fraction and apparent single-interval exponential decay constant, preserving negative values for mass gain. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialDryMass, finalDryMass, elapsedTime } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(initialDryMass) && initialDryMass > 0,
      "initialDryMass",
    ),
      initialDryMass);
    (H.domain(
      Number.isFinite(finalDryMass) && finalDryMass > 0,
      "finalDryMass",
    ),
      finalDryMass);
    (H.domain(Number.isFinite(elapsedTime) && elapsedTime > 0, "elapsedTime"),
      elapsedTime);
    return {
      remainingFraction: finalDryMass / initialDryMass,
      apparentDecayConstant:
        (Math.log(initialDryMass) - Math.log(finalDryMass)) / elapsedTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialDryMass: 16, finalDryMass: 4, elapsedTime: 2 },
  output: {
    remainingFraction: 0.25,
    apparentDecayConstant: 0.6931471805599453,
  },
} satisfies ToolExample<Input, Output>;
export const leaflitterDecaySingleIntervalFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ecology/leaflitter-decay-single-interval-factor",
      title: "Leaflitter Decay Single Interval Factor Tool",
      description:
        "Calculate a supplied litter dry-mass remaining fraction and apparent single-interval exponential decay constant, preserving negative values for mass gain.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialDryMass: { type: "number", exclusiveMinimum: 0 },
          finalDryMass: { type: "number", exclusiveMinimum: 0 },
          elapsedTime: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["initialDryMass", "finalDryMass", "elapsedTime"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remainingFraction: { type: "number" },
          apparentDecayConstant: { type: "number" },
        },
        required: ["remainingFraction", "apparentDecayConstant"],
      },
      ports: {
        inputs: [
          {
            id: "initialDryMass",
            label: "Initial Dry Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "finalDryMass",
            label: "Final Dry Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "elapsedTime",
            label: "Elapsed Time",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remainingFraction",
            label: "Remaining Fraction",
            valueType: { type: "number" },
          },
          {
            id: "apparentDecayConstant",
            label: "Apparent Decay Constant",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = leaflitterDecaySingleIntervalFactorTool.execute;
export default leaflitterDecaySingleIntervalFactorTool;

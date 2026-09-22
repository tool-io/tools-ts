import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oxidantConcentration: number;
  readonly duration: number;
  readonly reactionRateCoefficient: number;
};
export type Output = {
  readonly exposure: number;
  readonly firstOrderExponent: number;
  readonly retainedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oxidantConcentration: { type: "number", minimum: 0 },
    duration: { type: "number", minimum: 0 },
    reactionRateCoefficient: { type: "number", minimum: 0 },
  },
  required: ["oxidantConcentration", "duration", "reactionRateCoefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposure: { type: "number" },
    firstOrderExponent: { type: "number" },
    retainedFraction: { type: "number" },
  },
  required: ["exposure", "firstOrderExponent", "retainedFraction"],
} as const;
/** Constant oxidant exposure and ideal first-order target retention, without a toxicological safety inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oxidantConcentration, duration, reactionRateCoefficient } = request;
  const compute = (): Output => {
    H.domain(
      oxidantConcentration >= 0 &&
        duration >= 0 &&
        reactionRateCoefficient >= 0,
    );
    return {
      exposure: oxidantConcentration * duration,
      firstOrderExponent:
        oxidantConcentration * duration * reactionRateCoefficient,
      retainedFraction: Math.exp(
        -oxidantConcentration * duration * reactionRateCoefficient,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oxidantConcentration: 2, duration: 3, reactionRateCoefficient: 0.5 },
  output: {
    exposure: 6,
    firstOrderExponent: 3,
    retainedFraction: 0.049787068367863944,
  },
} satisfies ToolExample<Input, Output>;
export const oxidationExposureConcentrationTimeProductTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-chemistry/oxidation-exposure-concentration-time-product",
      title: "Oxidation Exposure Concentration Time Product Tool",
      description:
        "Constant oxidant exposure and ideal first-order target retention, without a toxicological safety inference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          oxidantConcentration: { type: "number", minimum: 0 },
          duration: { type: "number", minimum: 0 },
          reactionRateCoefficient: { type: "number", minimum: 0 },
        },
        required: [
          "oxidantConcentration",
          "duration",
          "reactionRateCoefficient",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          exposure: { type: "number" },
          firstOrderExponent: { type: "number" },
          retainedFraction: { type: "number" },
        },
        required: ["exposure", "firstOrderExponent", "retainedFraction"],
      },
      ports: {
        inputs: [
          {
            id: "oxidantConcentration",
            label: "Oxidant Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "duration",
            label: "Duration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reactionRateCoefficient",
            label: "Reaction Rate Coefficient",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "exposure", label: "Exposure", valueType: { type: "number" } },
          {
            id: "firstOrderExponent",
            label: "First Order Exponent",
            valueType: { type: "number" },
          },
          {
            id: "retainedFraction",
            label: "Retained Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = oxidationExposureConcentrationTimeProductTool.execute;
export default oxidationExposureConcentrationTimeProductTool;

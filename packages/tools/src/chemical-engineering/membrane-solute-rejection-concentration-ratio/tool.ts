import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feedConcentration: number;
  readonly permeateConcentration: number;
  readonly feedFlow: number;
  readonly permeateFlow: number;
};
export type Output = {
  readonly observedRejection: number;
  readonly recoveryFraction: number;
  readonly soluteTransmissionRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedConcentration: { type: "number", exclusiveMinimum: 0 },
    permeateConcentration: { type: "number", minimum: 0 },
    feedFlow: { type: "number", exclusiveMinimum: 0 },
    permeateFlow: { type: "number", minimum: 0 },
  },
  required: [
    "feedConcentration",
    "permeateConcentration",
    "feedFlow",
    "permeateFlow",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedRejection: { type: "number" },
    recoveryFraction: { type: "number" },
    soluteTransmissionRate: { type: "number" },
  },
  required: ["observedRejection", "recoveryFraction", "soluteTransmissionRate"],
} as const;
/** Calculate membrane solute rejection concentration ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { feedConcentration, permeateConcentration, feedFlow, permeateFlow } =
    request;
  const compute = (): Output => {
    H.positive(feedConcentration);
    H.domain(permeateConcentration >= 0 && permeateFlow >= 0);
    H.positive(feedFlow);
    H.domain(permeateFlow <= feedFlow);
    return {
      observedRejection: 1 - permeateConcentration / feedConcentration,
      recoveryFraction: permeateFlow / feedFlow,
      soluteTransmissionRate: permeateConcentration * permeateFlow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    feedConcentration: 10,
    permeateConcentration: 2,
    feedFlow: 100,
    permeateFlow: 20,
  },
  output: {
    observedRejection: 0.8,
    recoveryFraction: 0.2,
    soluteTransmissionRate: 40,
  },
} satisfies ToolExample<Input, Output>;
export const membraneSoluteRejectionConcentrationRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "chemical-engineering/membrane-solute-rejection-concentration-ratio",
      title: "Membrane Solute Rejection Concentration Ratio Tool",
      description:
        "Calculate membrane solute rejection concentration ratio from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          feedConcentration: { type: "number", exclusiveMinimum: 0 },
          permeateConcentration: { type: "number", minimum: 0 },
          feedFlow: { type: "number", exclusiveMinimum: 0 },
          permeateFlow: { type: "number", minimum: 0 },
        },
        required: [
          "feedConcentration",
          "permeateConcentration",
          "feedFlow",
          "permeateFlow",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedRejection: { type: "number" },
          recoveryFraction: { type: "number" },
          soluteTransmissionRate: { type: "number" },
        },
        required: [
          "observedRejection",
          "recoveryFraction",
          "soluteTransmissionRate",
        ],
      },
      ports: {
        inputs: [
          {
            id: "feedConcentration",
            label: "Feed Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "permeateConcentration",
            label: "Permeate Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "feedFlow",
            label: "Feed Flow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "permeateFlow",
            label: "Permeate Flow",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "observedRejection",
            label: "Observed Rejection",
            valueType: { type: "number" },
          },
          {
            id: "recoveryFraction",
            label: "Recovery Fraction",
            valueType: { type: "number" },
          },
          {
            id: "soluteTransmissionRate",
            label: "Solute Transmission Rate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = membraneSoluteRejectionConcentrationRatioTool.execute;
export default membraneSoluteRejectionConcentrationRatioTool;

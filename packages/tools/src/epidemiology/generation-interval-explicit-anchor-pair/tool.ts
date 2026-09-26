import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly infectorInfection: number;
  readonly infecteeInfection: number;
  readonly infectorUncertainty: number;
  readonly infecteeUncertainty: number;
};
export type Output = {
  readonly interval: number;
  readonly minimumInterval: number;
  readonly maximumInterval: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    infectorInfection: { type: "number" },
    infecteeInfection: { type: "number" },
    infectorUncertainty: { type: "number", minimum: 0 },
    infecteeUncertainty: { type: "number", minimum: 0 },
  },
  required: [
    "infectorInfection",
    "infecteeInfection",
    "infectorUncertainty",
    "infecteeUncertainty",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interval: { type: "number" },
    minimumInterval: { type: "number" },
    maximumInterval: { type: "number" },
  },
  required: ["interval", "minimumInterval", "maximumInterval"],
} as const;
/** Infection-time generation interval with conservative endpoint uncertainty propagation; a negative lower interval flags overlapping uncertainty. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    infectorInfection,
    infecteeInfection,
    infectorUncertainty,
    infecteeUncertainty,
  } = request;
  const compute = (): Output => {
    H.domain(
      infecteeInfection >= infectorInfection &&
        infectorUncertainty >= 0 &&
        infecteeUncertainty >= 0,
    );
    return {
      interval: infecteeInfection - infectorInfection,
      minimumInterval:
        infecteeInfection -
        infectorInfection -
        infectorUncertainty -
        infecteeUncertainty,
      maximumInterval:
        infecteeInfection -
        infectorInfection +
        infectorUncertainty +
        infecteeUncertainty,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    infectorInfection: 10,
    infecteeInfection: 15,
    infectorUncertainty: 1,
    infecteeUncertainty: 2,
  },
  output: { interval: 5, minimumInterval: 2, maximumInterval: 8 },
} satisfies ToolExample<Input, Output>;
export const generationIntervalExplicitAnchorPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epidemiology/generation-interval-explicit-anchor-pair",
      title: "Generation Interval Explicit Anchor Pair Tool",
      description:
        "Infection-time generation interval with conservative endpoint uncertainty propagation; a negative lower interval flags overlapping uncertainty.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          infectorInfection: { type: "number" },
          infecteeInfection: { type: "number" },
          infectorUncertainty: { type: "number", minimum: 0 },
          infecteeUncertainty: { type: "number", minimum: 0 },
        },
        required: [
          "infectorInfection",
          "infecteeInfection",
          "infectorUncertainty",
          "infecteeUncertainty",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          interval: { type: "number" },
          minimumInterval: { type: "number" },
          maximumInterval: { type: "number" },
        },
        required: ["interval", "minimumInterval", "maximumInterval"],
      },
      ports: {
        inputs: [
          {
            id: "infectorInfection",
            label: "Infector Infection",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "infecteeInfection",
            label: "Infectee Infection",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "infectorUncertainty",
            label: "Infector Uncertainty",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "infecteeUncertainty",
            label: "Infectee Uncertainty",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "interval", label: "Interval", valueType: { type: "number" } },
          {
            id: "minimumInterval",
            label: "Minimum Interval",
            valueType: { type: "number" },
          },
          {
            id: "maximumInterval",
            label: "Maximum Interval",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = generationIntervalExplicitAnchorPairTool.execute;
export default generationIntervalExplicitAnchorPairTool;

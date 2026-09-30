import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedBenefit: number;
  readonly baselineBenefit: number;
  readonly attributionFraction: number;
  readonly realizedFraction: number;
};
export type Output = {
  readonly attributableIncrement: number;
  readonly realizedBenefit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedBenefit: { type: "number" },
    baselineBenefit: { type: "number" },
    attributionFraction: { type: "number", minimum: 0, maximum: 1 },
    realizedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "observedBenefit",
    "baselineBenefit",
    "attributionFraction",
    "realizedFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attributableIncrement: { type: "number" },
    realizedBenefit: { type: "number" },
  },
  required: ["attributableIncrement", "realizedBenefit"],
} as const;
/** Calculate benefits realization attribution share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    observedBenefit,
    baselineBenefit,
    attributionFraction,
    realizedFraction,
  } = request;
  const compute = (): Output => {
    H.probability(attributionFraction);
    H.probability(realizedFraction);
    return {
      attributableIncrement:
        (observedBenefit - baselineBenefit) * attributionFraction,
      realizedBenefit:
        (observedBenefit - baselineBenefit) *
        attributionFraction *
        realizedFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedBenefit: 150,
    baselineBenefit: 100,
    attributionFraction: 0.5,
    realizedFraction: 0.8,
  },
  output: { attributableIncrement: 25, realizedBenefit: 20 },
} satisfies ToolExample<Input, Output>;
export const benefitsRealizationAttributionShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "management/benefits-realization-attribution-share",
      title: "Benefits Realization Attribution Share Tool",
      description:
        "Calculate benefits realization attribution share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedBenefit: { type: "number" },
          baselineBenefit: { type: "number" },
          attributionFraction: { type: "number", minimum: 0, maximum: 1 },
          realizedFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "observedBenefit",
          "baselineBenefit",
          "attributionFraction",
          "realizedFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          attributableIncrement: { type: "number" },
          realizedBenefit: { type: "number" },
        },
        required: ["attributableIncrement", "realizedBenefit"],
      },
      ports: {
        inputs: [
          {
            id: "observedBenefit",
            label: "Observed Benefit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "baselineBenefit",
            label: "Baseline Benefit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "attributionFraction",
            label: "Attribution Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "realizedFraction",
            label: "Realized Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "attributableIncrement",
            label: "Attributable Increment",
            valueType: { type: "number" },
          },
          {
            id: "realizedBenefit",
            label: "Realized Benefit",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = benefitsRealizationAttributionShareTool.execute;
export default benefitsRealizationAttributionShareTool;

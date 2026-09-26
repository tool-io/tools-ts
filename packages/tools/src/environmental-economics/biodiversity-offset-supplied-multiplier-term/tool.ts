import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly impactedArea: number;
  readonly conditionFraction: number;
  readonly requiredMultiplier: number;
  readonly creditPerRestoredArea: number;
};
export type Output = {
  readonly lostUnits: number;
  readonly requiredCredits: number;
  readonly restoredArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    impactedArea: { type: "number", minimum: 0 },
    conditionFraction: { type: "number", minimum: 0, maximum: 1 },
    requiredMultiplier: { type: "number", minimum: 0 },
    creditPerRestoredArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "impactedArea",
    "conditionFraction",
    "requiredMultiplier",
    "creditPerRestoredArea",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lostUnits: { type: "number" },
    requiredCredits: { type: "number" },
    restoredArea: { type: "number" },
  },
  required: ["lostUnits", "requiredCredits", "restoredArea"],
} as const;
/** Explicit unit arithmetic with a supplied multiplier, without asserting ecological equivalence or regulatory acceptance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    impactedArea,
    conditionFraction,
    requiredMultiplier,
    creditPerRestoredArea,
  } = request;
  const compute = (): Output => {
    H.domain(impactedArea >= 0 && requiredMultiplier >= 0);
    H.probability(conditionFraction);
    H.positive(creditPerRestoredArea);
    return {
      lostUnits: impactedArea * conditionFraction,
      requiredCredits: impactedArea * conditionFraction * requiredMultiplier,
      restoredArea:
        (impactedArea * conditionFraction * requiredMultiplier) /
        creditPerRestoredArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    impactedArea: 10,
    conditionFraction: 0.8,
    requiredMultiplier: 2,
    creditPerRestoredArea: 0.5,
  },
  output: { lostUnits: 8, requiredCredits: 16, restoredArea: 32 },
} satisfies ToolExample<Input, Output>;
export const biodiversityOffsetSuppliedMultiplierTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-economics/biodiversity-offset-supplied-multiplier-term",
      title: "Biodiversity Offset Supplied Multiplier Term Tool",
      description:
        "Explicit unit arithmetic with a supplied multiplier, without asserting ecological equivalence or regulatory acceptance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          impactedArea: { type: "number", minimum: 0 },
          conditionFraction: { type: "number", minimum: 0, maximum: 1 },
          requiredMultiplier: { type: "number", minimum: 0 },
          creditPerRestoredArea: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "impactedArea",
          "conditionFraction",
          "requiredMultiplier",
          "creditPerRestoredArea",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lostUnits: { type: "number" },
          requiredCredits: { type: "number" },
          restoredArea: { type: "number" },
        },
        required: ["lostUnits", "requiredCredits", "restoredArea"],
      },
      ports: {
        inputs: [
          {
            id: "impactedArea",
            label: "Impacted Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "conditionFraction",
            label: "Condition Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "requiredMultiplier",
            label: "Required Multiplier",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "creditPerRestoredArea",
            label: "Credit Per Restored Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "lostUnits",
            label: "Lost Units",
            valueType: { type: "number" },
          },
          {
            id: "requiredCredits",
            label: "Required Credits",
            valueType: { type: "number" },
          },
          {
            id: "restoredArea",
            label: "Restored Area",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biodiversityOffsetSuppliedMultiplierTermTool.execute;
export default biodiversityOffsetSuppliedMultiplierTermTool;

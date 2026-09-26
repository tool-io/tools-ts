import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly subsidy: number;
  readonly observedReduction: number;
  readonly additionalFraction: number;
  readonly leakageFraction: number;
};
export type Output = {
  readonly additionalReduction: number;
  readonly netReduction: number;
  readonly subsidyPerNetUnit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subsidy: { type: "number", minimum: 0 },
    observedReduction: { type: "number", exclusiveMinimum: 0 },
    additionalFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    leakageFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: [
    "subsidy",
    "observedReduction",
    "additionalFraction",
    "leakageFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    additionalReduction: { type: "number" },
    netReduction: { type: "number" },
    subsidyPerNetUnit: { type: "number" },
  },
  required: ["additionalReduction", "netReduction", "subsidyPerNetUnit"],
} as const;
/** Calculate environmental subsidy additionality caller share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { subsidy, observedReduction, additionalFraction, leakageFraction } =
    request;
  const compute = (): Output => {
    H.domain(
      subsidy >= 0 &&
        observedReduction > 0 &&
        additionalFraction > 0 &&
        additionalFraction <= 1 &&
        leakageFraction >= 0 &&
        leakageFraction < 1,
    );
    return {
      additionalReduction: observedReduction * additionalFraction,
      netReduction:
        observedReduction * additionalFraction * (1 - leakageFraction),
      subsidyPerNetUnit:
        subsidy /
        (observedReduction * additionalFraction * (1 - leakageFraction)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    subsidy: 10000,
    observedReduction: 1000,
    additionalFraction: 0.5,
    leakageFraction: 0.2,
  },
  output: {
    additionalReduction: 500,
    netReduction: 400,
    subsidyPerNetUnit: 25,
  },
} satisfies ToolExample<Input, Output>;
export const environmentalSubsidyAdditionalityCallerShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-economics/environmental-subsidy-additionality-caller-share",
      title: "Environmental Subsidy Additionality Caller Share Tool",
      description:
        "Calculate environmental subsidy additionality caller share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          subsidy: { type: "number", minimum: 0 },
          observedReduction: { type: "number", exclusiveMinimum: 0 },
          additionalFraction: {
            type: "number",
            exclusiveMinimum: 0,
            maximum: 1,
          },
          leakageFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        },
        required: [
          "subsidy",
          "observedReduction",
          "additionalFraction",
          "leakageFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          additionalReduction: { type: "number" },
          netReduction: { type: "number" },
          subsidyPerNetUnit: { type: "number" },
        },
        required: ["additionalReduction", "netReduction", "subsidyPerNetUnit"],
      },
      ports: {
        inputs: [
          {
            id: "subsidy",
            label: "Subsidy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observedReduction",
            label: "Observed Reduction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "additionalFraction",
            label: "Additional Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "leakageFraction",
            label: "Leakage Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "additionalReduction",
            label: "Additional Reduction",
            valueType: { type: "number" },
          },
          {
            id: "netReduction",
            label: "Net Reduction",
            valueType: { type: "number" },
          },
          {
            id: "subsidyPerNetUnit",
            label: "Subsidy Per Net Unit",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = environmentalSubsidyAdditionalityCallerShareTool.execute;
export default environmentalSubsidyAdditionalityCallerShareTool;

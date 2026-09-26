import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exitProceeds: number;
  readonly investment: number;
  readonly preferenceMultiple: number;
  readonly ownershipFraction: number;
};
export type Output = {
  readonly preferredPayment: number;
  readonly commonPayment: number;
  readonly converted: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exitProceeds: { type: "number", minimum: 0 },
    investment: { type: "number", minimum: 0 },
    preferenceMultiple: { type: "number", minimum: 0 },
    ownershipFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "exitProceeds",
    "investment",
    "preferenceMultiple",
    "ownershipFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preferredPayment: { type: "number" },
    commonPayment: { type: "number" },
    converted: { type: "boolean" },
  },
  required: ["preferredPayment", "commonPayment", "converted"],
} as const;
/** Single senior nonparticipating preference with an optional common conversion; excludes other senior claims and participation caps. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exitProceeds, investment, preferenceMultiple, ownershipFraction } =
    request;
  const compute = (): Output => {
    H.domain(exitProceeds >= 0 && investment >= 0 && preferenceMultiple >= 0);
    H.probability(ownershipFraction);
    return {
      preferredPayment: Math.max(
        Math.min(exitProceeds, investment * preferenceMultiple),
        exitProceeds * ownershipFraction,
      ),
      commonPayment:
        exitProceeds -
        Math.max(
          Math.min(exitProceeds, investment * preferenceMultiple),
          exitProceeds * ownershipFraction,
        ),
      converted:
        exitProceeds * ownershipFraction >
        Math.min(exitProceeds, investment * preferenceMultiple),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    exitProceeds: 10000000,
    investment: 2000000,
    preferenceMultiple: 1,
    ownershipFraction: 0.3,
  },
  output: {
    preferredPayment: 3000000,
    commonPayment: 7000000,
    converted: true,
  },
} satisfies ToolExample<Input, Output>;
export const ventureLiquidationPreferenceOneTierTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "entrepreneurship-studies/venture-liquidation-preference-one-tier",
      title: "Venture Liquidation Preference One Tier Tool",
      description:
        "Single senior nonparticipating preference with an optional common conversion; excludes other senior claims and participation caps.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          exitProceeds: { type: "number", minimum: 0 },
          investment: { type: "number", minimum: 0 },
          preferenceMultiple: { type: "number", minimum: 0 },
          ownershipFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "exitProceeds",
          "investment",
          "preferenceMultiple",
          "ownershipFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          preferredPayment: { type: "number" },
          commonPayment: { type: "number" },
          converted: { type: "boolean" },
        },
        required: ["preferredPayment", "commonPayment", "converted"],
      },
      ports: {
        inputs: [
          {
            id: "exitProceeds",
            label: "Exit Proceeds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "investment",
            label: "Investment",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "preferenceMultiple",
            label: "Preference Multiple",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "ownershipFraction",
            label: "Ownership Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "preferredPayment",
            label: "Preferred Payment",
            valueType: { type: "number" },
          },
          {
            id: "commonPayment",
            label: "Common Payment",
            valueType: { type: "number" },
          },
          {
            id: "converted",
            label: "Converted",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ventureLiquidationPreferenceOneTierTool.execute;
export default ventureLiquidationPreferenceOneTierTool;

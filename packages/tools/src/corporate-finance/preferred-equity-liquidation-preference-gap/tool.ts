import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preferenceAmount: number;
  readonly availableProceeds: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preferenceAmount: { type: "number" },
    availableProceeds: { type: "number" },
  },
  required: ["preferenceAmount", "availableProceeds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied available proceeds minus an explicit liquidation preference amount without allocating a distribution waterfall. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preferenceAmount, availableProceeds } = request;
  const compute = (): Output => {
    return { signedGap: availableProceeds - preferenceAmount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { preferenceAmount: 12, availableProceeds: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const preferredEquityLiquidationPreferenceGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "trading"],
        fields: [
          "corporate-finance",
          "corporate finance",
          "business and finance",
        ],
        keywords: ["corporate finance", "business and finance"],
      },
      id: "corporate-finance/preferred-equity-liquidation-preference-gap",
      title: "Preferred Equity Liquidation Preference Gap",
      description:
        "Calculate supplied available proceeds minus an explicit liquidation preference amount without allocating a distribution waterfall.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          preferenceAmount: { type: "number" },
          availableProceeds: { type: "number" },
        },
        required: ["preferenceAmount", "availableProceeds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedGap: { type: "number" } },
        required: ["signedGap"],
      },
      ports: {
        inputs: [
          {
            id: "preferenceAmount",
            label: "Preference Amount",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "availableProceeds",
            label: "Available Proceeds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = preferredEquityLiquidationPreferenceGapTool.execute;
export default preferredEquityLiquidationPreferenceGapTool;

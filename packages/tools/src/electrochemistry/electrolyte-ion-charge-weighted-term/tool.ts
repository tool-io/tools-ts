import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amountMoles: number;
  readonly chargeNumber: number;
};
export type Output = { readonly signedChargeEquivalents: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amountMoles: { type: "number", minimum: 0 },
    chargeNumber: { type: "integer" },
  },
  required: ["amountMoles", "chargeNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedChargeEquivalents: { type: "number" } },
  required: ["signedChargeEquivalents"],
} as const;
/** Multiply supplied ion amount by signed integer charge number to obtain signed molar charge equivalents without inferring ionic species. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amountMoles, chargeNumber } = request;
  const compute = (): Output => {
    H.domain(amountMoles >= 0, "amountMoles");
    (H.domain(
      Number.isSafeInteger(chargeNumber) &&
        chargeNumber >= -Number.MAX_SAFE_INTEGER &&
        chargeNumber <= Number.MAX_SAFE_INTEGER,
      "chargeNumber",
    ),
      chargeNumber);
    return { signedChargeEquivalents: amountMoles * chargeNumber };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amountMoles: 2, chargeNumber: -1 },
  output: { signedChargeEquivalents: -2 },
} satisfies ToolExample<Input, Output>;
export const electrolyteIonChargeWeightedTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/electrolyte-ion-charge-weighted-term",
    title: "Electrolyte Ion Charge Weighted Term Tool",
    description:
      "Multiply supplied ion amount by signed integer charge number to obtain signed molar charge equivalents without inferring ionic species.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amountMoles: { type: "number", minimum: 0 },
        chargeNumber: { type: "integer" },
      },
      required: ["amountMoles", "chargeNumber"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedChargeEquivalents: { type: "number" } },
      required: ["signedChargeEquivalents"],
    },
    ports: {
      inputs: [
        {
          id: "amountMoles",
          label: "Amount Moles",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "chargeNumber",
          label: "Charge Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "signedChargeEquivalents",
          label: "Signed Charge Equivalents",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = electrolyteIonChargeWeightedTermTool.execute;
export default electrolyteIonChargeWeightedTermTool;

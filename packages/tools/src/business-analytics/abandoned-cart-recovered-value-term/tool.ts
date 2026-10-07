import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cartValue: number;
  readonly recoveredFraction: number;
};
export type Output = {
  readonly recoveredValue: number;
  readonly remainingValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cartValue: { type: "number", minimum: 0 },
    recoveredFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["cartValue", "recoveredFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recoveredValue: { type: "number" },
    remainingValue: { type: "number" },
  },
  required: ["recoveredValue", "remainingValue"],
} as const;
/** Apply an explicit recovered fraction to supplied abandoned-cart value without predicting customer behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cartValue, recoveredFraction } = request;
  const compute = (): Output => {
    H.domain(cartValue >= 0, "cartValue");
    (H.domain(
      recoveredFraction >= 0 && recoveredFraction <= 1,
      "recoveredFraction",
    ),
      recoveredFraction);
    return {
      recoveredValue: cartValue * recoveredFraction,
      remainingValue: cartValue * (1 - recoveredFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cartValue: 200, recoveredFraction: 0.25 },
  output: { recoveredValue: 50, remainingValue: 150 },
} satisfies ToolExample<Input, Output>;
export const abandonedCartRecoveredValueTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-analytics",
        "business analytics",
        "business and finance",
      ],
      keywords: ["business analytics", "business and finance"],
    },
    id: "business-analytics/abandoned-cart-recovered-value-term",
    title: "Abandoned Cart Recovered Value Term",
    description:
      "Apply an explicit recovered fraction to supplied abandoned-cart value without predicting customer behavior.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cartValue: { type: "number", minimum: 0 },
        recoveredFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["cartValue", "recoveredFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recoveredValue: { type: "number" },
        remainingValue: { type: "number" },
      },
      required: ["recoveredValue", "remainingValue"],
    },
    ports: {
      inputs: [
        {
          id: "cartValue",
          label: "Cart Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recoveredFraction",
          label: "Recovered Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recoveredValue",
          label: "Recovered Value",
          valueType: { type: "number" },
        },
        {
          id: "remainingValue",
          label: "Remaining Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = abandonedCartRecoveredValueTermTool.execute;
export default abandonedCartRecoveredValueTermTool;

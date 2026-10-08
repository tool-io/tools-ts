import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleBase: number;
  readonly defaultTipFraction: number;
  readonly selectedTipFraction: number;
};
export type Output = {
  readonly defaultTip: number;
  readonly selectedTip: number;
  readonly change: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleBase: { type: "number", minimum: 0 },
    defaultTipFraction: { type: "number", minimum: 0 },
    selectedTipFraction: { type: "number", minimum: 0 },
  },
  required: ["eligibleBase", "defaultTipFraction", "selectedTipFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    defaultTip: { type: "number" },
    selectedTip: { type: "number" },
    change: { type: "number" },
  },
  required: ["defaultTip", "selectedTip", "change"],
} as const;
/** Compare explicit default and selected tip fractions on a supplied base without choosing tipping policy or rounding money. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleBase, defaultTipFraction, selectedTipFraction } = request;
  const compute = (): Output => {
    H.domain(eligibleBase >= 0, "eligibleBase");
    H.domain(defaultTipFraction >= 0, "defaultTipFraction");
    H.domain(selectedTipFraction >= 0, "selectedTipFraction");
    return {
      defaultTip: eligibleBase * defaultTipFraction,
      selectedTip: eligibleBase * selectedTipFraction,
      change: eligibleBase * (selectedTipFraction - defaultTipFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligibleBase: 100,
    defaultTipFraction: 0.2,
    selectedTipFraction: 0.25,
  },
  output: { defaultTip: 20, selectedTip: 25, change: 4.999999999999999 },
} satisfies ToolExample<Input, Output>;
export const checkoutTipDefaultChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "consumer-behavior",
        "consumer behavior",
        "business and finance",
      ],
      keywords: ["consumer behavior", "business and finance"],
    },
    id: "consumer-behavior/checkout-tip-default-change",
    title: "Checkout Tip Default Change",
    description:
      "Compare explicit default and selected tip fractions on a supplied base without choosing tipping policy or rounding money.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleBase: { type: "number", minimum: 0 },
        defaultTipFraction: { type: "number", minimum: 0 },
        selectedTipFraction: { type: "number", minimum: 0 },
      },
      required: ["eligibleBase", "defaultTipFraction", "selectedTipFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defaultTip: { type: "number" },
        selectedTip: { type: "number" },
        change: { type: "number" },
      },
      required: ["defaultTip", "selectedTip", "change"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleBase",
          label: "Eligible Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "defaultTipFraction",
          label: "Default Tip Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "selectedTipFraction",
          label: "Selected Tip Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "defaultTip",
          label: "Default Tip",
          valueType: { type: "number" },
        },
        {
          id: "selectedTip",
          label: "Selected Tip",
          valueType: { type: "number" },
        },
        { id: "change", label: "Change", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = checkoutTipDefaultChangeTool.execute;
export default checkoutTipDefaultChangeTool;

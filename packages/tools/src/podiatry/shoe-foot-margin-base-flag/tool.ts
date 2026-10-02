import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shoeLength: number;
  readonly footLength: number;
  readonly allowance: number;
  readonly allowanceIncluded: boolean;
};
export type Output = {
  readonly rawMargin: number;
  readonly remainingMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shoeLength: { type: "number", minimum: 0 },
    footLength: { type: "number", minimum: 0 },
    allowance: { type: "number", minimum: 0 },
    allowanceIncluded: { type: "boolean" },
  },
  required: ["shoeLength", "footLength", "allowance", "allowanceIncluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawMargin: { type: "number" },
    remainingMargin: { type: "number" },
  },
  required: ["rawMargin", "remainingMargin"],
} as const;
/** Compare supplied lengths with an explicit allowance debit without footwear fit advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shoeLength, footLength, allowance, allowanceIncluded } = request;
  const compute = (): Output => {
    H.domain(shoeLength >= 0 && footLength >= 0 && allowance >= 0);
    return {
      rawMargin: shoeLength - footLength,
      remainingMargin:
        shoeLength - footLength - (allowanceIncluded ? allowance : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    shoeLength: 270,
    footLength: 250,
    allowance: 10,
    allowanceIncluded: true,
  },
  output: { rawMargin: 20, remainingMargin: 10 },
} satisfies ToolExample<Input, Output>;
export const shoeFootMarginBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "podiatry/shoe-foot-margin-base-flag",
    title: "Shoe Foot Margin Base Flag Tool",
    description:
      "Compare supplied lengths with an explicit allowance debit without footwear fit advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shoeLength: { type: "number", minimum: 0 },
        footLength: { type: "number", minimum: 0 },
        allowance: { type: "number", minimum: 0 },
        allowanceIncluded: { type: "boolean" },
      },
      required: ["shoeLength", "footLength", "allowance", "allowanceIncluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawMargin: { type: "number" },
        remainingMargin: { type: "number" },
      },
      required: ["rawMargin", "remainingMargin"],
    },
    ports: {
      inputs: [
        {
          id: "shoeLength",
          label: "Shoe Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "footLength",
          label: "Foot Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowance",
          label: "Allowance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allowanceIncluded",
          label: "Allowance Included",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "rawMargin", label: "Raw Margin", valueType: { type: "number" } },
        {
          id: "remainingMargin",
          label: "Remaining Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = shoeFootMarginBaseFlagTool.execute;
export default shoeFootMarginBaseFlagTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baskets: number;
  readonly primaryBaskets: number;
  readonly jointBaskets: number;
};
export type Output = {
  readonly conditionalShare: number;
  readonly jointShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baskets: { type: "integer", minimum: 1 },
    primaryBaskets: { type: "integer", minimum: 1 },
    jointBaskets: { type: "integer", minimum: 0 },
  },
  required: ["baskets", "primaryBaskets", "jointBaskets"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditionalShare: { type: "number" },
    jointShare: { type: "number" },
  },
  required: ["conditionalShare", "jointShare"],
} as const;
/** Calculate basket cross sell one item share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baskets, primaryBaskets, jointBaskets } = request;
  const compute = (): Output => {
    H.integer(baskets, 1);
    H.integer(primaryBaskets, 1, baskets);
    H.integer(jointBaskets, 0, primaryBaskets);
    return {
      conditionalShare: jointBaskets / primaryBaskets,
      jointShare: jointBaskets / baskets,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baskets: 1000, primaryBaskets: 200, jointBaskets: 50 },
  output: { conditionalShare: 0.25, jointShare: 0.05 },
} satisfies ToolExample<Input, Output>;
export const basketCrossSellOneItemShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/basket-cross-sell-one-item-share",
    title: "Basket Cross Sell One Item Share Tool",
    description:
      "Calculate basket cross sell one item share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baskets: { type: "integer", minimum: 1 },
        primaryBaskets: { type: "integer", minimum: 1 },
        jointBaskets: { type: "integer", minimum: 0 },
      },
      required: ["baskets", "primaryBaskets", "jointBaskets"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conditionalShare: { type: "number" },
        jointShare: { type: "number" },
      },
      required: ["conditionalShare", "jointShare"],
    },
    ports: {
      inputs: [
        {
          id: "baskets",
          label: "Baskets",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "primaryBaskets",
          label: "Primary Baskets",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "jointBaskets",
          label: "Joint Baskets",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "conditionalShare",
          label: "Conditional Share",
          valueType: { type: "number" },
        },
        {
          id: "jointShare",
          label: "Joint Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = basketCrossSellOneItemShareTool.execute;
export default basketCrossSellOneItemShareTool;

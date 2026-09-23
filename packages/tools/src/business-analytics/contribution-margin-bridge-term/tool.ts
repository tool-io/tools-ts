import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldQuantity: number;
  readonly newQuantity: number;
  readonly oldUnitMargin: number;
  readonly newUnitMargin: number;
  readonly useNewQuantityForMargin: boolean;
};
export type Output = {
  readonly quantityEffect: number;
  readonly marginEffect: number;
  readonly crossTerm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldQuantity: { type: "number", minimum: 0 },
    newQuantity: { type: "number", minimum: 0 },
    oldUnitMargin: { type: "number" },
    newUnitMargin: { type: "number" },
    useNewQuantityForMargin: { type: "boolean" },
  },
  required: [
    "oldQuantity",
    "newQuantity",
    "oldUnitMargin",
    "newUnitMargin",
    "useNewQuantityForMargin",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantityEffect: { type: "number" },
    marginEffect: { type: "number" },
    crossTerm: { type: "number" },
  },
  required: ["quantityEffect", "marginEffect", "crossTerm"],
} as const;
/** Decompose supplied quantity/unit-margin changes under either exact two-factor bridge order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    oldQuantity,
    newQuantity,
    oldUnitMargin,
    newUnitMargin,
    useNewQuantityForMargin,
  } = request;
  const compute = (): Output => {
    H.domain(oldQuantity >= 0 && newQuantity >= 0);
    return {
      quantityEffect:
        (newQuantity - oldQuantity) *
        (useNewQuantityForMargin ? oldUnitMargin : newUnitMargin),
      marginEffect:
        (newUnitMargin - oldUnitMargin) *
        (useNewQuantityForMargin ? newQuantity : oldQuantity),
      crossTerm: (newQuantity - oldQuantity) * (newUnitMargin - oldUnitMargin),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    oldQuantity: 100,
    newQuantity: 120,
    oldUnitMargin: 5,
    newUnitMargin: 6,
    useNewQuantityForMargin: true,
  },
  output: { quantityEffect: 100, marginEffect: 120, crossTerm: 20 },
} satisfies ToolExample<Input, Output>;
export const contributionMarginBridgeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/contribution-margin-bridge-term",
    title: "Contribution Margin Bridge Term Tool",
    description:
      "Decompose supplied quantity/unit-margin changes under either exact two-factor bridge order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldQuantity: { type: "number", minimum: 0 },
        newQuantity: { type: "number", minimum: 0 },
        oldUnitMargin: { type: "number" },
        newUnitMargin: { type: "number" },
        useNewQuantityForMargin: { type: "boolean" },
      },
      required: [
        "oldQuantity",
        "newQuantity",
        "oldUnitMargin",
        "newUnitMargin",
        "useNewQuantityForMargin",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantityEffect: { type: "number" },
        marginEffect: { type: "number" },
        crossTerm: { type: "number" },
      },
      required: ["quantityEffect", "marginEffect", "crossTerm"],
    },
    ports: {
      inputs: [
        {
          id: "oldQuantity",
          label: "Old Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newQuantity",
          label: "New Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldUnitMargin",
          label: "Old Unit Margin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newUnitMargin",
          label: "New Unit Margin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useNewQuantityForMargin",
          label: "Use New Quantity For Margin",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "quantityEffect",
          label: "Quantity Effect",
          valueType: { type: "number" },
        },
        {
          id: "marginEffect",
          label: "Margin Effect",
          valueType: { type: "number" },
        },
        { id: "crossTerm", label: "Cross Term", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = contributionMarginBridgeTermTool.execute;
export default contributionMarginBridgeTermTool;

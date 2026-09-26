import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bond: number;
  readonly acceptedFraction: number;
  readonly retainedCosts: number;
  readonly refunded: number;
};
export type Output = {
  readonly grossEntitlement: number;
  readonly remainingRefund: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bond: { type: "number", minimum: 0 },
    acceptedFraction: { type: "number", minimum: 0, maximum: 1 },
    retainedCosts: { type: "number", minimum: 0 },
    refunded: { type: "number", minimum: 0 },
  },
  required: ["bond", "acceptedFraction", "retainedCosts", "refunded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossEntitlement: { type: "number" },
    remainingRefund: { type: "number" },
  },
  required: ["grossEntitlement", "remainingRefund"],
} as const;
/** Calculate restoration bond refund share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bond, acceptedFraction, retainedCosts, refunded } = request;
  const compute = (): Output => {
    H.domain(bond >= 0 && retainedCosts >= 0 && refunded >= 0);
    H.probability(acceptedFraction);
    return {
      grossEntitlement: bond * acceptedFraction,
      remainingRefund: bond * acceptedFraction - retainedCosts - refunded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bond: 1000,
    acceptedFraction: 0.8,
    retainedCosts: 100,
    refunded: 200,
  },
  output: { grossEntitlement: 800, remainingRefund: 500 },
} satisfies ToolExample<Input, Output>;
export const restorationBondRefundShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/restoration-bond-refund-share",
    title: "Restoration Bond Refund Share Tool",
    description:
      "Calculate restoration bond refund share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bond: { type: "number", minimum: 0 },
        acceptedFraction: { type: "number", minimum: 0, maximum: 1 },
        retainedCosts: { type: "number", minimum: 0 },
        refunded: { type: "number", minimum: 0 },
      },
      required: ["bond", "acceptedFraction", "retainedCosts", "refunded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossEntitlement: { type: "number" },
        remainingRefund: { type: "number" },
      },
      required: ["grossEntitlement", "remainingRefund"],
    },
    ports: {
      inputs: [
        {
          id: "bond",
          label: "Bond",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "acceptedFraction",
          label: "Accepted Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "retainedCosts",
          label: "Retained Costs",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refunded",
          label: "Refunded",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossEntitlement",
          label: "Gross Entitlement",
          valueType: { type: "number" },
        },
        {
          id: "remainingRefund",
          label: "Remaining Refund",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = restorationBondRefundShareTool.execute;
export default restorationBondRefundShareTool;

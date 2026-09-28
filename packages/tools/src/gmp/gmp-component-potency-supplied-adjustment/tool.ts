import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetActiveMass: number;
  readonly suppliedPotency: number;
  readonly moistureFraction: number;
};
export type Output = {
  readonly dryEquivalent: number;
  readonly asReceivedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetActiveMass: { type: "number", minimum: 0 },
    suppliedPotency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    moistureFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["targetActiveMass", "suppliedPotency", "moistureFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryEquivalent: { type: "number" },
    asReceivedMass: { type: "number" },
  },
  required: ["dryEquivalent", "asReceivedMass"],
} as const;
/** Explicit potency/moisture mass bookkeeping without selecting a formulation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetActiveMass, suppliedPotency, moistureFraction } = request;
  const compute = (): Output => {
    H.domain(
      targetActiveMass >= 0 &&
        suppliedPotency > 0 &&
        suppliedPotency <= 1 &&
        moistureFraction >= 0 &&
        moistureFraction < 1,
    );
    return {
      dryEquivalent: targetActiveMass / suppliedPotency,
      asReceivedMass:
        targetActiveMass / (suppliedPotency * (1 - moistureFraction)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targetActiveMass: 80, suppliedPotency: 0.8, moistureFraction: 0.2 },
  output: { dryEquivalent: 100, asReceivedMass: 124.99999999999997 },
} satisfies ToolExample<Input, Output>;
export const gmpComponentPotencySuppliedAdjustmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gmp/gmp-component-potency-supplied-adjustment",
      title: "GMP Component Potency Supplied Adjustment Tool",
      description:
        "Explicit potency/moisture mass bookkeeping without selecting a formulation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          targetActiveMass: { type: "number", minimum: 0 },
          suppliedPotency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
          moistureFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        },
        required: ["targetActiveMass", "suppliedPotency", "moistureFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dryEquivalent: { type: "number" },
          asReceivedMass: { type: "number" },
        },
        required: ["dryEquivalent", "asReceivedMass"],
      },
      ports: {
        inputs: [
          {
            id: "targetActiveMass",
            label: "Target Active Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedPotency",
            label: "Supplied Potency",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "moistureFraction",
            label: "Moisture Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "dryEquivalent",
            label: "Dry Equivalent",
            valueType: { type: "number" },
          },
          {
            id: "asReceivedMass",
            label: "As Received Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = gmpComponentPotencySuppliedAdjustmentTool.execute;
export default gmpComponentPotencySuppliedAdjustmentTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly physical: number;
  readonly reserved: number;
  readonly quarantined: number;
  readonly sharedExclusion: number;
};
export type Output = {
  readonly available: number;
  readonly reservedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physical: { type: "integer", minimum: 1 },
    reserved: { type: "integer", minimum: 0 },
    quarantined: { type: "integer", minimum: 0 },
    sharedExclusion: { type: "integer", minimum: 0 },
  },
  required: ["physical", "reserved", "quarantined", "sharedExclusion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    available: { type: "integer" },
    reservedFraction: { type: "number" },
  },
  required: ["available", "reservedFraction"],
} as const;
/** Calculate protective stock reserve fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { physical, reserved, quarantined, sharedExclusion } = request;
  const compute = (): Output => {
    H.integer(physical, 1);
    H.integer(reserved, 0, physical);
    H.integer(quarantined, 0, physical);
    H.integer(sharedExclusion, 0, Math.min(reserved, quarantined));
    H.domain(reserved + quarantined - sharedExclusion <= physical);
    return {
      available: physical - reserved - quarantined + sharedExclusion,
      reservedFraction: reserved / physical,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { physical: 100, reserved: 20, quarantined: 10, sharedExclusion: 5 },
  output: { available: 75, reservedFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const protectiveStockReserveFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/protective-stock-reserve-fraction",
    title: "Protective Stock Reserve Fraction Tool",
    description:
      "Calculate protective stock reserve fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        physical: { type: "integer", minimum: 1 },
        reserved: { type: "integer", minimum: 0 },
        quarantined: { type: "integer", minimum: 0 },
        sharedExclusion: { type: "integer", minimum: 0 },
      },
      required: ["physical", "reserved", "quarantined", "sharedExclusion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        available: { type: "integer" },
        reservedFraction: { type: "number" },
      },
      required: ["available", "reservedFraction"],
    },
    ports: {
      inputs: [
        {
          id: "physical",
          label: "Physical",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reserved",
          label: "Reserved",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "quarantined",
          label: "Quarantined",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sharedExclusion",
          label: "Shared Exclusion",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "available", label: "Available", valueType: { type: "integer" } },
        {
          id: "reservedFraction",
          label: "Reserved Fraction",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = protectiveStockReserveFractionTool.execute;
export default protectiveStockReserveFractionTool;

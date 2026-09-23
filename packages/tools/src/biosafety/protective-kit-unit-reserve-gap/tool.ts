import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly available: number;
  readonly kitsNeeded: number;
  readonly unitsPerKit: number;
  readonly reserveUnits: number;
};
export type Output = {
  readonly requiredUnits: number;
  readonly signedSurplus: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    available: { type: "integer", minimum: 0 },
    kitsNeeded: { type: "integer", minimum: 0 },
    unitsPerKit: { type: "integer", minimum: 1 },
    reserveUnits: { type: "integer", minimum: 0 },
  },
  required: ["available", "kitsNeeded", "unitsPerKit", "reserveUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredUnits: { type: "integer" },
    signedSurplus: { type: "integer" },
  },
  required: ["requiredUnits", "signedSurplus"],
} as const;
/** Generic protective-supply inventory accounting; no kit specification or biosafety determination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { available, kitsNeeded, unitsPerKit, reserveUnits } = request;
  const compute = (): Output => {
    H.integer(available, 0);
    H.integer(kitsNeeded, 0);
    H.integer(unitsPerKit, 1);
    H.integer(reserveUnits, 0);
    return {
      requiredUnits: Number(
        BigInt(kitsNeeded) * BigInt(unitsPerKit) + BigInt(reserveUnits),
      ),
      signedSurplus: Number(
        BigInt(available) -
          BigInt(kitsNeeded) * BigInt(unitsPerKit) -
          BigInt(reserveUnits),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { available: 100, kitsNeeded: 20, unitsPerKit: 3, reserveUnits: 10 },
  output: { requiredUnits: 70, signedSurplus: 30 },
} satisfies ToolExample<Input, Output>;
export const protectiveKitUnitReserveGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/protective-kit-unit-reserve-gap",
    title: "Protective Kit Unit Reserve Gap Tool",
    description:
      "Generic protective-supply inventory accounting; no kit specification or biosafety determination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        available: { type: "integer", minimum: 0 },
        kitsNeeded: { type: "integer", minimum: 0 },
        unitsPerKit: { type: "integer", minimum: 1 },
        reserveUnits: { type: "integer", minimum: 0 },
      },
      required: ["available", "kitsNeeded", "unitsPerKit", "reserveUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredUnits: { type: "integer" },
        signedSurplus: { type: "integer" },
      },
      required: ["requiredUnits", "signedSurplus"],
    },
    ports: {
      inputs: [
        {
          id: "available",
          label: "Available",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "kitsNeeded",
          label: "Kits Needed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitsPerKit",
          label: "Units Per Kit",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reserveUnits",
          label: "Reserve Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "requiredUnits",
          label: "Required Units",
          valueType: { type: "integer" },
        },
        {
          id: "signedSurplus",
          label: "Signed Surplus",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = protectiveKitUnitReserveGapTool.execute;
export default protectiveKitUnitReserveGapTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sumpCapacity: number;
  readonly currentVolume: number;
  readonly expectedReturn: number;
  readonly reservedFreeVolume: number;
};
export type Output = {
  readonly projectedVolume: number;
  readonly remainingFreeVolume: number;
  readonly reserveGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sumpCapacity: { type: "number", minimum: 0 },
    currentVolume: { type: "number", minimum: 0 },
    expectedReturn: { type: "number", minimum: 0 },
    reservedFreeVolume: { type: "number", minimum: 0 },
  },
  required: [
    "sumpCapacity",
    "currentVolume",
    "expectedReturn",
    "reservedFreeVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projectedVolume: { type: "number" },
    remainingFreeVolume: { type: "number" },
    reserveGap: { type: "number" },
  },
  required: ["projectedVolume", "remainingFreeVolume", "reserveGap"],
} as const;
/** Nominal supplied sump volume budget without hydraulic or animal-welfare guarantees. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sumpCapacity, currentVolume, expectedReturn, reservedFreeVolume } =
    request;
  const compute = (): Output => {
    H.domain(
      sumpCapacity >= 0 &&
        currentVolume >= 0 &&
        expectedReturn >= 0 &&
        reservedFreeVolume >= 0,
    );
    return {
      projectedVolume: currentVolume + expectedReturn,
      remainingFreeVolume: sumpCapacity - currentVolume - expectedReturn,
      reserveGap:
        sumpCapacity - currentVolume - expectedReturn - reservedFreeVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sumpCapacity: 100,
    currentVolume: 40,
    expectedReturn: 30,
    reservedFreeVolume: 20,
  },
  output: { projectedVolume: 70, remainingFreeVolume: 30, reserveGap: 10 },
} satisfies ToolExample<Input, Output>;
export const aquaponicSumpReserveGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/aquaponic-sump-reserve-gap",
    title: "Aquaponic Sump Reserve Gap Tool",
    description:
      "Nominal supplied sump volume budget without hydraulic or animal-welfare guarantees.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sumpCapacity: { type: "number", minimum: 0 },
        currentVolume: { type: "number", minimum: 0 },
        expectedReturn: { type: "number", minimum: 0 },
        reservedFreeVolume: { type: "number", minimum: 0 },
      },
      required: [
        "sumpCapacity",
        "currentVolume",
        "expectedReturn",
        "reservedFreeVolume",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        projectedVolume: { type: "number" },
        remainingFreeVolume: { type: "number" },
        reserveGap: { type: "number" },
      },
      required: ["projectedVolume", "remainingFreeVolume", "reserveGap"],
    },
    ports: {
      inputs: [
        {
          id: "sumpCapacity",
          label: "Sump Capacity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentVolume",
          label: "Current Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expectedReturn",
          label: "Expected Return",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reservedFreeVolume",
          label: "Reserved Free Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "projectedVolume",
          label: "Projected Volume",
          valueType: { type: "number" },
        },
        {
          id: "remainingFreeVolume",
          label: "Remaining Free Volume",
          valueType: { type: "number" },
        },
        {
          id: "reserveGap",
          label: "Reserve Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquaponicSumpReserveGapTool.execute;
export default aquaponicSumpReserveGapTool;

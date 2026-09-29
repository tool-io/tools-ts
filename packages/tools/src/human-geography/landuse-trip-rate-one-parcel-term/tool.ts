import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly floorArea: number;
  readonly unitArea: number;
  readonly tripRate: number;
  readonly passbyFraction: number;
  readonly internalCaptureFraction: number;
};
export type Output = {
  readonly grossTrips: number;
  readonly externalNewTrips: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    floorArea: { type: "number", minimum: 0 },
    unitArea: { type: "number", exclusiveMinimum: 0 },
    tripRate: { type: "number", minimum: 0 },
    passbyFraction: { type: "number", minimum: 0, maximum: 1 },
    internalCaptureFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "floorArea",
    "unitArea",
    "tripRate",
    "passbyFraction",
    "internalCaptureFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossTrips: { type: "number" },
    externalNewTrips: { type: "number" },
  },
  required: ["grossTrips", "externalNewTrips"],
} as const;
/** Supplied trip-generation rate with sequential pass-by and internal-capture reductions; no land-use rate table is embedded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    floorArea,
    unitArea,
    tripRate,
    passbyFraction,
    internalCaptureFraction,
  } = request;
  const compute = (): Output => {
    H.domain(floorArea >= 0 && tripRate >= 0);
    H.positive(unitArea);
    H.probability(passbyFraction);
    H.probability(internalCaptureFraction);
    return {
      grossTrips: (floorArea * tripRate) / unitArea,
      externalNewTrips:
        (floorArea *
          tripRate *
          (1 - passbyFraction) *
          (1 - internalCaptureFraction)) /
        unitArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    floorArea: 1000,
    unitArea: 100,
    tripRate: 5,
    passbyFraction: 0.2,
    internalCaptureFraction: 0.1,
  },
  output: { grossTrips: 50, externalNewTrips: 36 },
} satisfies ToolExample<Input, Output>;
export const landuseTripRateOneParcelTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/landuse-trip-rate-one-parcel-term",
    title: "Landuse Trip Rate One Parcel Term Tool",
    description:
      "Supplied trip-generation rate with sequential pass-by and internal-capture reductions; no land-use rate table is embedded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        floorArea: { type: "number", minimum: 0 },
        unitArea: { type: "number", exclusiveMinimum: 0 },
        tripRate: { type: "number", minimum: 0 },
        passbyFraction: { type: "number", minimum: 0, maximum: 1 },
        internalCaptureFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "floorArea",
        "unitArea",
        "tripRate",
        "passbyFraction",
        "internalCaptureFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossTrips: { type: "number" },
        externalNewTrips: { type: "number" },
      },
      required: ["grossTrips", "externalNewTrips"],
    },
    ports: {
      inputs: [
        {
          id: "floorArea",
          label: "Floor Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitArea",
          label: "Unit Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tripRate",
          label: "Trip Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "passbyFraction",
          label: "Passby Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "internalCaptureFraction",
          label: "Internal Capture Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossTrips",
          label: "Gross Trips",
          valueType: { type: "number" },
        },
        {
          id: "externalNewTrips",
          label: "External New Trips",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = landuseTripRateOneParcelTermTool.execute;
export default landuseTripRateOneParcelTermTool;

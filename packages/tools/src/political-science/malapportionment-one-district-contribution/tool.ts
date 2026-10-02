import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly districtSeats: number;
  readonly totalSeats: number;
  readonly districtPopulation: number;
  readonly totalPopulation: number;
};
export type Output = {
  readonly seatShare: number;
  readonly populationShare: number;
  readonly halfAbsoluteGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    districtSeats: { type: "integer", minimum: 0 },
    totalSeats: { type: "integer", minimum: 1 },
    districtPopulation: { type: "number", minimum: 0 },
    totalPopulation: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "districtSeats",
    "totalSeats",
    "districtPopulation",
    "totalPopulation",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seatShare: { type: "number" },
    populationShare: { type: "number" },
    halfAbsoluteGap: { type: "number" },
  },
  required: ["seatShare", "populationShare", "halfAbsoluteGap"],
} as const;
/** One district contribution to the half-sum absolute seat/population share discrepancy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { districtSeats, totalSeats, districtPopulation, totalPopulation } =
    request;
  const compute = (): Output => {
    H.integer(totalSeats, 1);
    H.integer(districtSeats, 0, totalSeats);
    H.positive(totalPopulation);
    H.domain(districtPopulation >= 0 && districtPopulation <= totalPopulation);
    return {
      seatShare: districtSeats / totalSeats,
      populationShare: districtPopulation / totalPopulation,
      halfAbsoluteGap:
        Math.abs(
          districtSeats / totalSeats - districtPopulation / totalPopulation,
        ) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    districtSeats: 3,
    totalSeats: 10,
    districtPopulation: 20,
    totalPopulation: 100,
  },
  output: {
    seatShare: 0.3,
    populationShare: 0.2,
    halfAbsoluteGap: 0.04999999999999999,
  },
} satisfies ToolExample<Input, Output>;
export const malapportionmentOneDistrictContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "political-science/malapportionment-one-district-contribution",
      title: "Malapportionment One District Contribution Tool",
      description:
        "One district contribution to the half-sum absolute seat/population share discrepancy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          districtSeats: { type: "integer", minimum: 0 },
          totalSeats: { type: "integer", minimum: 1 },
          districtPopulation: { type: "number", minimum: 0 },
          totalPopulation: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "districtSeats",
          "totalSeats",
          "districtPopulation",
          "totalPopulation",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          seatShare: { type: "number" },
          populationShare: { type: "number" },
          halfAbsoluteGap: { type: "number" },
        },
        required: ["seatShare", "populationShare", "halfAbsoluteGap"],
      },
      ports: {
        inputs: [
          {
            id: "districtSeats",
            label: "District Seats",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "totalSeats",
            label: "Total Seats",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "districtPopulation",
            label: "District Population",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalPopulation",
            label: "Total Population",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "seatShare",
            label: "Seat Share",
            valueType: { type: "number" },
          },
          {
            id: "populationShare",
            label: "Population Share",
            valueType: { type: "number" },
          },
          {
            id: "halfAbsoluteGap",
            label: "Half Absolute Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = malapportionmentOneDistrictContributionTool.execute;
export default malapportionmentOneDistrictContributionTool;

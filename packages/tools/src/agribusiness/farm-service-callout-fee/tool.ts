import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fixedCalloutFee: number;
  readonly travelKilometers: number;
  readonly travelRate: number;
  readonly workHours: number;
  readonly hourlyRate: number;
};
export type Output = { readonly totalFee: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fixedCalloutFee: { type: "number", minimum: 0 },
    travelKilometers: { type: "number", minimum: 0 },
    travelRate: { type: "number", minimum: 0 },
    workHours: { type: "number", minimum: 0 },
    hourlyRate: { type: "number", minimum: 0 },
  },
  required: [
    "fixedCalloutFee",
    "travelKilometers",
    "travelRate",
    "workHours",
    "hourlyRate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalFee: { type: "number" } },
  required: ["totalFee"],
} as const;
/** Extend an explicitly quoted farm-service callout, travel and hourly-work fee without assigning taxes or a supplier tariff. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    fixedCalloutFee,
    travelKilometers,
    travelRate,
    workHours,
    hourlyRate,
  } = request;
  const compute = (): Output => {
    H.domain(
      fixedCalloutFee >= 0 &&
        travelKilometers >= 0 &&
        travelRate >= 0 &&
        workHours >= 0 &&
        hourlyRate >= 0,
      "fixedCalloutFee",
    );
    return {
      totalFee:
        fixedCalloutFee +
        travelKilometers * travelRate +
        workHours * hourlyRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fixedCalloutFee: 40,
    travelKilometers: 20,
    travelRate: 0.5,
    workHours: 2,
    hourlyRate: 30,
  },
  output: { totalFee: 110 },
} satisfies ToolExample<Input, Output>;
export const farmServiceCalloutFeeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "learn"],
      fields: ["agribusiness", "agriculture"],
      keywords: ["agribusiness", "agriculture"],
    },
    id: "agribusiness/farm-service-callout-fee",
    title: "Farm Service Callout Fee",
    description:
      "Extend an explicitly quoted farm-service callout, travel and hourly-work fee without assigning taxes or a supplier tariff.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fixedCalloutFee: { type: "number", minimum: 0 },
        travelKilometers: { type: "number", minimum: 0 },
        travelRate: { type: "number", minimum: 0 },
        workHours: { type: "number", minimum: 0 },
        hourlyRate: { type: "number", minimum: 0 },
      },
      required: [
        "fixedCalloutFee",
        "travelKilometers",
        "travelRate",
        "workHours",
        "hourlyRate",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { totalFee: { type: "number" } },
      required: ["totalFee"],
    },
    ports: {
      inputs: [
        {
          id: "fixedCalloutFee",
          label: "Fixed Callout Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "travelKilometers",
          label: "Travel Kilometers",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "travelRate",
          label: "Travel Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "workHours",
          label: "Work Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hourlyRate",
          label: "Hourly Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "totalFee", label: "Total Fee", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmServiceCalloutFeeTool.execute;
export default farmServiceCalloutFeeTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { calculate as occupancyNotation } from "../../pharmacodynamics/receptor-occupancy-unit-flag/tool.js";
export type Input = {
  readonly suppliedOccupancy: number;
  readonly valueIsPercent: boolean;
  readonly responseScale: number;
  readonly responseUnit: string;
};
export type Output = {
  readonly fraction: number;
  readonly contribution: number;
  readonly unit: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedOccupancy: { type: "number" },
    valueIsPercent: { type: "boolean" },
    responseScale: { type: "number" },
    responseUnit: { type: "string", maxLength: 8192 },
  },
  required: [
    "suppliedOccupancy",
    "valueIsPercent",
    "responseScale",
    "responseUnit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number" },
    contribution: { type: "number" },
    unit: { type: "string", maxLength: 8192 },
  },
  required: ["fraction", "contribution", "unit"],
} as const;
/** Scale a supplied nonclinical occupancy contribution with an explicit response unit, reusing occupancy notation arithmetic and allowing a signed response scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedOccupancy, valueIsPercent, responseScale, responseUnit } =
    request;
  const compute = (): Output => {
    H.domain(responseUnit.length > 0);
    const fraction = occupancyNotation({
      suppliedOccupancy,
      valueIsPercent,
      totalReceptors: 1,
    }).fraction;
    return {
      fraction,
      contribution: fraction * responseScale,
      unit: responseUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    suppliedOccupancy: 25,
    valueIsPercent: true,
    responseScale: 8,
    responseUnit: "bench-response",
  },
  output: { fraction: 0.25, contribution: 2, unit: "bench-response" },
} satisfies ToolExample<Input, Output>;
export const receptorOccupancyScaleTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacodynamics/receptor-occupancy-scale-term",
    title: "Receptor Occupancy Scale Term Tool",
    description:
      "Scale a supplied nonclinical occupancy contribution with an explicit response unit, reusing occupancy notation arithmetic and allowing a signed response scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedOccupancy: { type: "number" },
        valueIsPercent: { type: "boolean" },
        responseScale: { type: "number" },
        responseUnit: { type: "string", maxLength: 8192 },
      },
      required: [
        "suppliedOccupancy",
        "valueIsPercent",
        "responseScale",
        "responseUnit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        contribution: { type: "number" },
        unit: { type: "string", maxLength: 8192 },
      },
      required: ["fraction", "contribution", "unit"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedOccupancy",
          label: "Supplied Occupancy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "valueIsPercent",
          label: "Value Is Percent",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "responseScale",
          label: "Response Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responseUnit",
          label: "Response Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
        { id: "unit", label: "Unit", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = receptorOccupancyScaleTermTool.execute;
export default receptorOccupancyScaleTermTool;

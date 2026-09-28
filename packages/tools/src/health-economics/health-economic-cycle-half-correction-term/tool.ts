import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryValue: number;
  readonly exitValue: number;
  readonly cycleYears: number;
  readonly discountRate: number;
  readonly cycleStartYear: number;
};
export type Output = {
  readonly uncorrectedEntryValue: number;
  readonly halfCycleValue: number;
  readonly discountedHalfCycleValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryValue: { type: "number" },
    exitValue: { type: "number" },
    cycleYears: { type: "number", minimum: 0 },
    discountRate: { type: "number", exclusiveMinimum: -1 },
    cycleStartYear: { type: "number", minimum: 0 },
  },
  required: [
    "entryValue",
    "exitValue",
    "cycleYears",
    "discountRate",
    "cycleStartYear",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncorrectedEntryValue: { type: "number" },
    halfCycleValue: { type: "number" },
    discountedHalfCycleValue: { type: "number" },
  },
  required: [
    "uncorrectedEntryValue",
    "halfCycleValue",
    "discountedHalfCycleValue",
  ],
} as const;
/** Trapezoidal state-reward half-cycle correction with midpoint discounting, explicitly distinct from exact continuous integration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryValue, exitValue, cycleYears, discountRate, cycleStartYear } =
    request;
  const compute = (): Output => {
    H.domain(cycleYears >= 0 && discountRate > -1 && cycleStartYear >= 0);
    return {
      uncorrectedEntryValue: entryValue * cycleYears,
      halfCycleValue: ((entryValue + exitValue) * cycleYears) / 2,
      discountedHalfCycleValue:
        ((entryValue + exitValue) * cycleYears) /
        (2 * (1 + discountRate) ** (cycleStartYear + cycleYears / 2)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    entryValue: 100,
    exitValue: 80,
    cycleYears: 1,
    discountRate: 0,
    cycleStartYear: 2,
  },
  output: {
    uncorrectedEntryValue: 100,
    halfCycleValue: 90,
    discountedHalfCycleValue: 90,
  },
} satisfies ToolExample<Input, Output>;
export const healthEconomicCycleHalfCorrectionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-economics/health-economic-cycle-half-correction-term",
      title: "Health Economic Cycle Half Correction Term Tool",
      description:
        "Trapezoidal state-reward half-cycle correction with midpoint discounting, explicitly distinct from exact continuous integration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          entryValue: { type: "number" },
          exitValue: { type: "number" },
          cycleYears: { type: "number", minimum: 0 },
          discountRate: { type: "number", exclusiveMinimum: -1 },
          cycleStartYear: { type: "number", minimum: 0 },
        },
        required: [
          "entryValue",
          "exitValue",
          "cycleYears",
          "discountRate",
          "cycleStartYear",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          uncorrectedEntryValue: { type: "number" },
          halfCycleValue: { type: "number" },
          discountedHalfCycleValue: { type: "number" },
        },
        required: [
          "uncorrectedEntryValue",
          "halfCycleValue",
          "discountedHalfCycleValue",
        ],
      },
      ports: {
        inputs: [
          {
            id: "entryValue",
            label: "Entry Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exitValue",
            label: "Exit Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cycleYears",
            label: "Cycle Years",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "discountRate",
            label: "Discount Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cycleStartYear",
            label: "Cycle Start Year",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "uncorrectedEntryValue",
            label: "Uncorrected Entry Value",
            valueType: { type: "number" },
          },
          {
            id: "halfCycleValue",
            label: "Half Cycle Value",
            valueType: { type: "number" },
          },
          {
            id: "discountedHalfCycleValue",
            label: "Discounted Half Cycle Value",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthEconomicCycleHalfCorrectionTermTool.execute;
export default healthEconomicCycleHalfCorrectionTermTool;

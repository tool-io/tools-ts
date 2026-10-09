import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredHours: number;
  readonly suppliedCoveredHours: number;
};
export type Output = {
  readonly uncoveredHours: number;
  readonly excessCoverageHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredHours: { type: "number", minimum: 0 },
    suppliedCoveredHours: { type: "number", minimum: 0 },
  },
  required: ["requiredHours", "suppliedCoveredHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncoveredHours: { type: "number" },
    excessCoverageHours: { type: "number" },
  },
  required: ["uncoveredHours", "excessCoverageHours"],
} as const;
/** Compare supplied required and covered care hours without defining care requirements or assessing staffing adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredHours, suppliedCoveredHours } = request;
  const compute = (): Output => {
    H.domain(requiredHours >= 0, "requiredHours");
    H.domain(suppliedCoveredHours >= 0, "suppliedCoveredHours");
    return {
      uncoveredHours: Math.max(0, requiredHours - suppliedCoveredHours),
      excessCoverageHours: Math.max(0, suppliedCoveredHours - requiredHours),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredHours: 12, suppliedCoveredHours: 8 },
  output: { uncoveredHours: 4, excessCoverageHours: 0 },
} satisfies ToolExample<Input, Output>;
export const caregiverCoveredUncoveredHourGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/caregiver-covered-uncovered-hour-gap",
    title: "Caregiver Covered Uncovered Hour Gap Tool",
    description:
      "Compare supplied required and covered care hours without defining care requirements or assessing staffing adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredHours: { type: "number", minimum: 0 },
        suppliedCoveredHours: { type: "number", minimum: 0 },
      },
      required: ["requiredHours", "suppliedCoveredHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uncoveredHours: { type: "number" },
        excessCoverageHours: { type: "number" },
      },
      required: ["uncoveredHours", "excessCoverageHours"],
    },
    ports: {
      inputs: [
        {
          id: "requiredHours",
          label: "Required Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCoveredHours",
          label: "Supplied Covered Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uncoveredHours",
          label: "Uncovered Hours",
          valueType: { type: "number" },
        },
        {
          id: "excessCoverageHours",
          label: "Excess Coverage Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = caregiverCoveredUncoveredHourGapTool.execute;
export default caregiverCoveredUncoveredHourGapTool;

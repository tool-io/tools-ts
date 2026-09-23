import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly brightDwell: number;
  readonly darkDwell: number;
  readonly totalObservation: number;
};
export type Output = {
  readonly brightFraction: number;
  readonly expectedBrightTime: number;
  readonly cycles: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    brightDwell: { type: "number", minimum: 0 },
    darkDwell: { type: "number", minimum: 0 },
    totalObservation: { type: "number", minimum: 0 },
  },
  required: ["brightDwell", "darkDwell", "totalObservation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    brightFraction: { type: "number" },
    expectedBrightTime: { type: "number" },
    cycles: { type: "number" },
  },
  required: ["brightFraction", "expectedBrightTime", "cycles"],
} as const;
/** Stationary alternating bright/dark dwell approximation; no separate photophysical rates are inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { brightDwell, darkDwell, totalObservation } = request;
  const compute = (): Output => {
    H.domain(
      brightDwell >= 0 &&
        darkDwell >= 0 &&
        brightDwell + darkDwell > 0 &&
        totalObservation >= 0,
    );
    return {
      brightFraction: brightDwell / (brightDwell + darkDwell),
      expectedBrightTime:
        (totalObservation * brightDwell) / (brightDwell + darkDwell),
      cycles: totalObservation / (brightDwell + darkDwell),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { brightDwell: 3, darkDwell: 1, totalObservation: 100 },
  output: { brightFraction: 0.75, expectedBrightTime: 75, cycles: 25 },
} satisfies ToolExample<Input, Output>;
export const fluorophoreTripletStateDutyFractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biophysics/fluorophore-triplet-state-duty-fraction",
      title: "Fluorophore Triplet State Duty Fraction Tool",
      description:
        "Stationary alternating bright/dark dwell approximation; no separate photophysical rates are inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          brightDwell: { type: "number", minimum: 0 },
          darkDwell: { type: "number", minimum: 0 },
          totalObservation: { type: "number", minimum: 0 },
        },
        required: ["brightDwell", "darkDwell", "totalObservation"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          brightFraction: { type: "number" },
          expectedBrightTime: { type: "number" },
          cycles: { type: "number" },
        },
        required: ["brightFraction", "expectedBrightTime", "cycles"],
      },
      ports: {
        inputs: [
          {
            id: "brightDwell",
            label: "Bright Dwell",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "darkDwell",
            label: "Dark Dwell",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalObservation",
            label: "Total Observation",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "brightFraction",
            label: "Bright Fraction",
            valueType: { type: "number" },
          },
          {
            id: "expectedBrightTime",
            label: "Expected Bright Time",
            valueType: { type: "number" },
          },
          { id: "cycles", label: "Cycles", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = fluorophoreTripletStateDutyFractionTool.execute;
export default fluorophoreTripletStateDutyFractionTool;

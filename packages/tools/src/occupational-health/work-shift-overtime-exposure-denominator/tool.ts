import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regularHours: number;
  readonly overtimeHours: number;
  readonly regularConcentration: number;
  readonly overtimeConcentration: number;
  readonly referenceHours: number;
};
export type Output = {
  readonly actualHours: number;
  readonly actualAverage: number;
  readonly referenceContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regularHours: { type: "number", minimum: 0 },
    overtimeHours: { type: "number", minimum: 0 },
    regularConcentration: { type: "number", minimum: 0 },
    overtimeConcentration: { type: "number", minimum: 0 },
    referenceHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "regularHours",
    "overtimeHours",
    "regularConcentration",
    "overtimeConcentration",
    "referenceHours",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualHours: { type: "number" },
    actualAverage: { type: "number" },
    referenceContribution: { type: "number" },
  },
  required: ["actualHours", "actualAverage", "referenceContribution"],
} as const;
/** Calculate work shift overtime exposure denominator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    regularHours,
    overtimeHours,
    regularConcentration,
    overtimeConcentration,
    referenceHours,
  } = request;
  const compute = (): Output => {
    H.domain(
      regularHours >= 0 &&
        overtimeHours >= 0 &&
        regularHours + overtimeHours > 0 &&
        regularConcentration >= 0 &&
        overtimeConcentration >= 0,
    );
    H.positive(referenceHours);
    return {
      actualHours: regularHours + overtimeHours,
      actualAverage:
        (regularHours * regularConcentration +
          overtimeHours * overtimeConcentration) /
        (regularHours + overtimeHours),
      referenceContribution:
        (regularHours * regularConcentration +
          overtimeHours * overtimeConcentration) /
        referenceHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    regularHours: 8,
    overtimeHours: 2,
    regularConcentration: 2,
    overtimeConcentration: 4,
    referenceHours: 8,
  },
  output: { actualHours: 10, actualAverage: 2.4, referenceContribution: 3 },
} satisfies ToolExample<Input, Output>;
export const workShiftOvertimeExposureDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "occupational-health/work-shift-overtime-exposure-denominator",
      title: "Work Shift Overtime Exposure Denominator Tool",
      description:
        "Calculate work shift overtime exposure denominator from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          regularHours: { type: "number", minimum: 0 },
          overtimeHours: { type: "number", minimum: 0 },
          regularConcentration: { type: "number", minimum: 0 },
          overtimeConcentration: { type: "number", minimum: 0 },
          referenceHours: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "regularHours",
          "overtimeHours",
          "regularConcentration",
          "overtimeConcentration",
          "referenceHours",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          actualHours: { type: "number" },
          actualAverage: { type: "number" },
          referenceContribution: { type: "number" },
        },
        required: ["actualHours", "actualAverage", "referenceContribution"],
      },
      ports: {
        inputs: [
          {
            id: "regularHours",
            label: "Regular Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "overtimeHours",
            label: "Overtime Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "regularConcentration",
            label: "Regular Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "overtimeConcentration",
            label: "Overtime Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceHours",
            label: "Reference Hours",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "actualHours",
            label: "Actual Hours",
            valueType: { type: "number" },
          },
          {
            id: "actualAverage",
            label: "Actual Average",
            valueType: { type: "number" },
          },
          {
            id: "referenceContribution",
            label: "Reference Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = workShiftOvertimeExposureDenominatorTool.execute;
export default workShiftOvertimeExposureDenominatorTool;

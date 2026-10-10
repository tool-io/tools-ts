import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedAccumulation: number;
  readonly carryIn: number;
  readonly carryOut: number;
};
export type Output = { readonly windowAccumulation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedAccumulation: { type: "number", minimum: 0 },
    carryIn: { type: "number", minimum: 0 },
    carryOut: { type: "number", minimum: 0 },
  },
  required: ["reportedAccumulation", "carryIn", "carryOut"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { windowAccumulation: { type: "number" } },
  required: ["windowAccumulation"],
} as const;
/** Apply explicit carry-in and carry-out attribution adjustments to a precipitation reporting total without redistributing a time series. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedAccumulation, carryIn, carryOut } = request;
  const compute = (): Output => {
    H.domain(
      reportedAccumulation >= 0 && carryIn >= 0 && carryOut >= 0,
      "reportedAccumulation",
    );
    return { windowAccumulation: reportedAccumulation - carryIn + carryOut };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedAccumulation: 12, carryIn: 2, carryOut: 3 },
  output: { windowAccumulation: 13 },
} satisfies ToolExample<Input, Output>;
export const precipitationReportingWindowCarryOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["hydrometeorology", "earth and environmental sciences"],
        keywords: ["hydrometeorology", "earth and environmental sciences"],
      },
      id: "hydrometeorology/precipitation-reporting-window-carry-offset",
      title: "Precipitation Reporting Window Carry Offset",
      description:
        "Apply explicit carry-in and carry-out attribution adjustments to a precipitation reporting total without redistributing a time series.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reportedAccumulation: { type: "number", minimum: 0 },
          carryIn: { type: "number", minimum: 0 },
          carryOut: { type: "number", minimum: 0 },
        },
        required: ["reportedAccumulation", "carryIn", "carryOut"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { windowAccumulation: { type: "number" } },
        required: ["windowAccumulation"],
      },
      ports: {
        inputs: [
          {
            id: "reportedAccumulation",
            label: "Reported Accumulation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "carryIn",
            label: "Carry In",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "carryOut",
            label: "Carry Out",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "windowAccumulation",
            label: "Window Accumulation",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = precipitationReportingWindowCarryOffsetTool.execute;
export default precipitationReportingWindowCarryOffsetTool;

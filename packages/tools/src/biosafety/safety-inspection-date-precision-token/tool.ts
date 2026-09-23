import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inspectionLower: number;
  readonly inspectionUpper: number;
  readonly checkDay: number;
};
export type Output = {
  readonly ageLower: number;
  readonly ageUpper: number;
  readonly exactDate: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inspectionLower: { type: "integer" },
    inspectionUpper: { type: "integer" },
    checkDay: { type: "integer" },
  },
  required: ["inspectionLower", "inspectionUpper", "checkDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageLower: { type: "integer" },
    ageUpper: { type: "integer" },
    exactDate: { type: "boolean" },
  },
  required: ["ageLower", "ageUpper", "exactDate"],
} as const;
/** Propagate supplied inspection date uncertainty without selecting inspection intervals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inspectionLower, inspectionUpper, checkDay } = request;
  const compute = (): Output => {
    H.domain(inspectionLower <= inspectionUpper);
    return {
      ageLower: checkDay - inspectionUpper,
      ageUpper: checkDay - inspectionLower,
      exactDate: inspectionLower === inspectionUpper,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inspectionLower: 100, inspectionUpper: 105, checkDay: 120 },
  output: { ageLower: 15, ageUpper: 20, exactDate: false },
} satisfies ToolExample<Input, Output>;
export const safetyInspectionDatePrecisionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/safety-inspection-date-precision-token",
    title: "Safety Inspection Date Precision Token Tool",
    description:
      "Propagate supplied inspection date uncertainty without selecting inspection intervals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inspectionLower: { type: "integer" },
        inspectionUpper: { type: "integer" },
        checkDay: { type: "integer" },
      },
      required: ["inspectionLower", "inspectionUpper", "checkDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageLower: { type: "integer" },
        ageUpper: { type: "integer" },
        exactDate: { type: "boolean" },
      },
      required: ["ageLower", "ageUpper", "exactDate"],
    },
    ports: {
      inputs: [
        {
          id: "inspectionLower",
          label: "Inspection Lower",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inspectionUpper",
          label: "Inspection Upper",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "checkDay",
          label: "Check Day",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "ageLower", label: "Age Lower", valueType: { type: "integer" } },
        { id: "ageUpper", label: "Age Upper", valueType: { type: "integer" } },
        {
          id: "exactDate",
          label: "Exact Date",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = safetyInspectionDatePrecisionTokenTool.execute;
export default safetyInspectionDatePrecisionTokenTool;

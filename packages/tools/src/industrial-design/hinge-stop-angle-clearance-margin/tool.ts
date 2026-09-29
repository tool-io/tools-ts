import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stopAngle: number;
  readonly requiredAngle: number;
  readonly tolerance: number;
};
export type Output = {
  readonly nominalMargin: number;
  readonly worstMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stopAngle: { type: "number" },
    requiredAngle: { type: "number" },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["stopAngle", "requiredAngle", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalMargin: { type: "number" },
    worstMargin: { type: "number" },
  },
  required: ["nominalMargin", "worstMargin"],
} as const;
/** Angular slack in consistent supplied units; no mechanical operating limit is chosen. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stopAngle, requiredAngle, tolerance } = request;
  const compute = (): Output => {
    H.domain(tolerance >= 0);
    return {
      nominalMargin: stopAngle - requiredAngle,
      worstMargin: stopAngle - requiredAngle - tolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stopAngle: 100, requiredAngle: 90, tolerance: 3 },
  output: { nominalMargin: 10, worstMargin: 7 },
} satisfies ToolExample<Input, Output>;
export const hingeStopAngleClearanceMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/hinge-stop-angle-clearance-margin",
    title: "Hinge Stop Angle Clearance Margin Tool",
    description:
      "Angular slack in consistent supplied units; no mechanical operating limit is chosen.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stopAngle: { type: "number" },
        requiredAngle: { type: "number" },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["stopAngle", "requiredAngle", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalMargin: { type: "number" },
        worstMargin: { type: "number" },
      },
      required: ["nominalMargin", "worstMargin"],
    },
    ports: {
      inputs: [
        {
          id: "stopAngle",
          label: "Stop Angle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredAngle",
          label: "Required Angle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nominalMargin",
          label: "Nominal Margin",
          valueType: { type: "number" },
        },
        {
          id: "worstMargin",
          label: "Worst Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hingeStopAngleClearanceMarginTool.execute;
export default hingeStopAngleClearanceMarginTool;

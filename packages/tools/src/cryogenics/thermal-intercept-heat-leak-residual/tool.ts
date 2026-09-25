import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly warmSegmentHeat: number;
  readonly interceptedHeat: number;
  readonly otherColdLoads: number;
};
export type Output = {
  readonly residualConductedHeat: number;
  readonly totalColdLoad: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    warmSegmentHeat: { type: "number", minimum: 0 },
    interceptedHeat: { type: "number", minimum: 0 },
    otherColdLoads: { type: "number", minimum: 0 },
  },
  required: ["warmSegmentHeat", "interceptedHeat", "otherColdLoads"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residualConductedHeat: { type: "number" },
    totalColdLoad: { type: "number" },
  },
  required: ["residualConductedHeat", "totalColdLoad"],
} as const;
/** Calculate thermal intercept heat leak residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { warmSegmentHeat, interceptedHeat, otherColdLoads } = request;
  const compute = (): Output => {
    H.domain(
      warmSegmentHeat >= 0 &&
        interceptedHeat >= 0 &&
        interceptedHeat <= warmSegmentHeat &&
        otherColdLoads >= 0,
    );
    return {
      residualConductedHeat: warmSegmentHeat - interceptedHeat,
      totalColdLoad: warmSegmentHeat - interceptedHeat + otherColdLoads,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { warmSegmentHeat: 10, interceptedHeat: 8, otherColdLoads: 1 },
  output: { residualConductedHeat: 2, totalColdLoad: 3 },
} satisfies ToolExample<Input, Output>;
export const thermalInterceptHeatLeakResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/thermal-intercept-heat-leak-residual",
    title: "Thermal Intercept Heat Leak Residual Tool",
    description:
      "Calculate thermal intercept heat leak residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        warmSegmentHeat: { type: "number", minimum: 0 },
        interceptedHeat: { type: "number", minimum: 0 },
        otherColdLoads: { type: "number", minimum: 0 },
      },
      required: ["warmSegmentHeat", "interceptedHeat", "otherColdLoads"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residualConductedHeat: { type: "number" },
        totalColdLoad: { type: "number" },
      },
      required: ["residualConductedHeat", "totalColdLoad"],
    },
    ports: {
      inputs: [
        {
          id: "warmSegmentHeat",
          label: "Warm Segment Heat",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interceptedHeat",
          label: "Intercepted Heat",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherColdLoads",
          label: "Other Cold Loads",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "residualConductedHeat",
          label: "Residual Conducted Heat",
          valueType: { type: "number" },
        },
        {
          id: "totalColdLoad",
          label: "Total Cold Load",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = thermalInterceptHeatLeakResidualTool.execute;
export default thermalInterceptHeatLeakResidualTool;

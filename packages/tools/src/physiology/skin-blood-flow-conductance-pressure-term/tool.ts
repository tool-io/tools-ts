import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flow: number;
  readonly arterialPressure: number;
  readonly venousPressure: number;
};
export type Output = {
  readonly pressureGradient: number;
  readonly conductance: number;
  readonly resistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flow: { type: "number" },
    arterialPressure: { type: "number" },
    venousPressure: { type: "number" },
  },
  required: ["flow", "arterialPressure", "venousPressure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressureGradient: { type: "number" },
    conductance: { type: "number" },
    resistance: { type: "number" },
  },
  required: ["pressureGradient", "conductance", "resistance"],
} as const;
/** Signed supplied flow/pressure-gradient conductance and reciprocal resistance, without vascular diagnosis or a perfusion target. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flow, arterialPressure, venousPressure } = request;
  const compute = (): Output => {
    H.domain(flow !== 0 && arterialPressure !== venousPressure);
    return {
      pressureGradient: arterialPressure - venousPressure,
      conductance: flow / (arterialPressure - venousPressure),
      resistance: (arterialPressure - venousPressure) / flow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flow: 10, arterialPressure: 100, venousPressure: 10 },
  output: {
    pressureGradient: 90,
    conductance: 0.1111111111111111,
    resistance: 9,
  },
} satisfies ToolExample<Input, Output>;
export const skinBloodFlowConductancePressureTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physiology/skin-blood-flow-conductance-pressure-term",
      title: "Skin Blood Flow Conductance Pressure Term Tool",
      description:
        "Signed supplied flow/pressure-gradient conductance and reciprocal resistance, without vascular diagnosis or a perfusion target.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          flow: { type: "number" },
          arterialPressure: { type: "number" },
          venousPressure: { type: "number" },
        },
        required: ["flow", "arterialPressure", "venousPressure"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pressureGradient: { type: "number" },
          conductance: { type: "number" },
          resistance: { type: "number" },
        },
        required: ["pressureGradient", "conductance", "resistance"],
      },
      ports: {
        inputs: [
          {
            id: "flow",
            label: "Flow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "arterialPressure",
            label: "Arterial Pressure",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "venousPressure",
            label: "Venous Pressure",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "pressureGradient",
            label: "Pressure Gradient",
            valueType: { type: "number" },
          },
          {
            id: "conductance",
            label: "Conductance",
            valueType: { type: "number" },
          },
          {
            id: "resistance",
            label: "Resistance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = skinBloodFlowConductancePressureTermTool.execute;
export default skinBloodFlowConductancePressureTermTool;

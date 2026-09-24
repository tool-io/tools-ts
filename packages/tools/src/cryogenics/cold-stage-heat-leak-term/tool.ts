import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly thermalConductance: number;
  readonly hotTemperature: number;
  readonly coldTemperature: number;
};
export type Output = { readonly heatFlow: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    thermalConductance: { type: "number", minimum: 0 },
    hotTemperature: { type: "number", minimum: 0 },
    coldTemperature: { type: "number", minimum: 0 },
  },
  required: ["thermalConductance", "hotTemperature", "coldTemperature"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { heatFlow: { type: "number" } },
  required: ["heatFlow"],
} as const;
/** Compute signed steady linear-conductance heat flow from supplied bench parameters. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { thermalConductance, hotTemperature, coldTemperature } = request;
  const compute = (): Output => {
    H.domain(
      thermalConductance >= 0 && hotTemperature >= 0 && coldTemperature >= 0,
    );
    return {
      heatFlow: thermalConductance * (hotTemperature - coldTemperature),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { thermalConductance: 0.1, hotTemperature: 300, coldTemperature: 20 },
  output: { heatFlow: 28 },
} satisfies ToolExample<Input, Output>;
export const coldStageHeatLeakTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/cold-stage-heat-leak-term",
    title: "Cold Stage Heat Leak Term Tool",
    description:
      "Compute signed steady linear-conductance heat flow from supplied bench parameters.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        thermalConductance: { type: "number", minimum: 0 },
        hotTemperature: { type: "number", minimum: 0 },
        coldTemperature: { type: "number", minimum: 0 },
      },
      required: ["thermalConductance", "hotTemperature", "coldTemperature"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { heatFlow: { type: "number" } },
      required: ["heatFlow"],
    },
    ports: {
      inputs: [
        {
          id: "thermalConductance",
          label: "Thermal Conductance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hotTemperature",
          label: "Hot Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coldTemperature",
          label: "Cold Temperature",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "heatFlow", label: "Heat Flow", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = coldStageHeatLeakTermTool.execute;
export default coldStageHeatLeakTermTool;

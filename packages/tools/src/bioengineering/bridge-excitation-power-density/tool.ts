import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly excitationVoltage: number;
  readonly bridgeResistance: number;
  readonly area: number;
};
export type Output = { readonly power: number; readonly powerPerArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    excitationVoltage: { type: "number" },
    bridgeResistance: { type: "number", exclusiveMinimum: 0 },
    area: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["excitationVoltage", "bridgeResistance", "area"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { power: { type: "number" }, powerPerArea: { type: "number" } },
  required: ["power", "powerPerArea"],
} as const;
/** Compute ideal resistive bridge excitation power per supplied area, without a thermal safety limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { excitationVoltage, bridgeResistance, area } = request;
  const compute = (): Output => {
    H.positive(bridgeResistance);
    H.positive(area);
    return {
      power: excitationVoltage ** 2 / bridgeResistance,
      powerPerArea: excitationVoltage ** 2 / bridgeResistance / area,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { excitationVoltage: 5, bridgeResistance: 100, area: 2 },
  output: { power: 0.25, powerPerArea: 0.125 },
} satisfies ToolExample<Input, Output>;
export const bridgeExcitationPowerDensityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/bridge-excitation-power-density",
    title: "Bridge Excitation Power Density Tool",
    description:
      "Compute ideal resistive bridge excitation power per supplied area, without a thermal safety limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        excitationVoltage: { type: "number" },
        bridgeResistance: { type: "number", exclusiveMinimum: 0 },
        area: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["excitationVoltage", "bridgeResistance", "area"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        power: { type: "number" },
        powerPerArea: { type: "number" },
      },
      required: ["power", "powerPerArea"],
    },
    ports: {
      inputs: [
        {
          id: "excitationVoltage",
          label: "Excitation Voltage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bridgeResistance",
          label: "Bridge Resistance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "power", label: "Power", valueType: { type: "number" } },
        {
          id: "powerPerArea",
          label: "Power Per Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bridgeExcitationPowerDensityTool.execute;
export default bridgeExcitationPowerDensityTool;

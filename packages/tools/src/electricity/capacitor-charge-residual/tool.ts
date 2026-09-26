import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredCharge: number;
  readonly capacitance: number;
  readonly measuredVoltage: number;
};
export type Output = {
  readonly expectedCharge: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredCharge: { type: "number" },
    capacitance: { type: "number", minimum: 0 },
    measuredVoltage: { type: "number" },
  },
  required: ["measuredCharge", "capacitance", "measuredVoltage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedCharge: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedCharge", "residual"],
} as const;
/** Compare supplied signed charge against C times measured voltage in compatible units; no charging transient model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredCharge, capacitance, measuredVoltage } = request;
  const compute = (): Output => {
    H.domain(capacitance >= 0);
    return {
      expectedCharge: capacitance * measuredVoltage,
      residual: measuredCharge - capacitance * measuredVoltage,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredCharge: 12, capacitance: 2, measuredVoltage: 5 },
  output: { expectedCharge: 10, residual: 2 },
} satisfies ToolExample<Input, Output>;
export const capacitorChargeResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/capacitor-charge-residual",
    title: "Capacitor Charge Residual Tool",
    description:
      "Compare supplied signed charge against C times measured voltage in compatible units; no charging transient model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredCharge: { type: "number" },
        capacitance: { type: "number", minimum: 0 },
        measuredVoltage: { type: "number" },
      },
      required: ["measuredCharge", "capacitance", "measuredVoltage"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedCharge: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expectedCharge", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "measuredCharge",
          label: "Measured Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capacitance",
          label: "Capacitance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredVoltage",
          label: "Measured Voltage",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedCharge",
          label: "Expected Charge",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = capacitorChargeResidualTool.execute;
export default capacitorChargeResidualTool;

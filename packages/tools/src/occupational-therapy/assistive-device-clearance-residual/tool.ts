import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: number;
  readonly deviceWidth: number;
  readonly suppliedAllowance: number;
};
export type Output = {
  readonly rawClearance: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "number", minimum: 0 },
    deviceWidth: { type: "number", minimum: 0 },
    suppliedAllowance: { type: "number", minimum: 0 },
  },
  required: ["opening", "deviceWidth", "suppliedAllowance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawClearance: { type: "number" },
    residual: { type: "number" },
  },
  required: ["rawClearance", "residual"],
} as const;
/** Supplied nominal bench clearance only, without assistive-device fit or safety advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opening, deviceWidth, suppliedAllowance } = request;
  const compute = (): Output => {
    H.domain(opening >= 0 && deviceWidth >= 0 && suppliedAllowance >= 0);
    return {
      rawClearance: opening - deviceWidth,
      residual: opening - deviceWidth - suppliedAllowance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { opening: 100, deviceWidth: 80, suppliedAllowance: 5 },
  output: { rawClearance: 20, residual: 15 },
} satisfies ToolExample<Input, Output>;
export const assistiveDeviceClearanceResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-therapy/assistive-device-clearance-residual",
    title: "Assistive Device Clearance Residual Tool",
    description:
      "Supplied nominal bench clearance only, without assistive-device fit or safety advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opening: { type: "number", minimum: 0 },
        deviceWidth: { type: "number", minimum: 0 },
        suppliedAllowance: { type: "number", minimum: 0 },
      },
      required: ["opening", "deviceWidth", "suppliedAllowance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawClearance: { type: "number" },
        residual: { type: "number" },
      },
      required: ["rawClearance", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "opening",
          label: "Opening",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deviceWidth",
          label: "Device Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedAllowance",
          label: "Supplied Allowance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rawClearance",
          label: "Raw Clearance",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = assistiveDeviceClearanceResidualTool.execute;
export default assistiveDeviceClearanceResidualTool;

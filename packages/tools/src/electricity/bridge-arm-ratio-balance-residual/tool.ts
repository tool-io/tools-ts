import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly topLeft: number;
  readonly bottomLeft: number;
  readonly topRight: number;
  readonly bottomRight: number;
  readonly supply: number;
};
export type Output = {
  readonly outputVoltage: number;
  readonly balanced: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topLeft: { type: "number", exclusiveMinimum: 0 },
    bottomLeft: { type: "number", exclusiveMinimum: 0 },
    topRight: { type: "number", exclusiveMinimum: 0 },
    bottomRight: { type: "number", exclusiveMinimum: 0 },
    supply: { type: "number" },
  },
  required: ["topLeft", "bottomLeft", "topRight", "bottomRight", "supply"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outputVoltage: { type: "number" },
    balanced: { type: "boolean" },
  },
  required: ["outputVoltage", "balanced"],
} as const;
/** Return ideal unloaded bridge midpoint voltage difference and the exact resistor-ratio balance flag. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { topLeft, bottomLeft, topRight, bottomRight, supply } = input;
  const compute = (): Output => {
    H.positive(topLeft);
    H.positive(bottomLeft);
    H.positive(topRight);
    H.positive(bottomRight);
    const outputVoltage =
      supply *
      (bottomLeft / (topLeft + bottomLeft) -
        bottomRight / (topRight + bottomRight));
    return {
      outputVoltage,
      balanced: topLeft * bottomRight === topRight * bottomLeft,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { topLeft: 1, bottomLeft: 1, topRight: 1, bottomRight: 3, supply: 4 },
  output: { outputVoltage: -1, balanced: false },
} satisfies ToolExample<Input, Output>;
export const bridgeArmRatioBalanceResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/bridge-arm-ratio-balance-residual",
    title: "Bridge Arm Ratio Balance Residual Tool",
    description:
      "Return ideal unloaded bridge midpoint voltage difference and the exact resistor-ratio balance flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        topLeft: { type: "number", exclusiveMinimum: 0 },
        bottomLeft: { type: "number", exclusiveMinimum: 0 },
        topRight: { type: "number", exclusiveMinimum: 0 },
        bottomRight: { type: "number", exclusiveMinimum: 0 },
        supply: { type: "number" },
      },
      required: ["topLeft", "bottomLeft", "topRight", "bottomRight", "supply"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outputVoltage: { type: "number" },
        balanced: { type: "boolean" },
      },
      required: ["outputVoltage", "balanced"],
    },
    ports: {
      inputs: [
        {
          id: "topLeft",
          label: "Top Left",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bottomLeft",
          label: "Bottom Left",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "topRight",
          label: "Top Right",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bottomRight",
          label: "Bottom Right",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "supply",
          label: "Supply",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "outputVoltage",
          label: "Output Voltage",
          valueType: { type: "number" },
        },
        { id: "balanced", label: "Balanced", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = bridgeArmRatioBalanceResidualTool.execute;
export default bridgeArmRatioBalanceResidualTool;

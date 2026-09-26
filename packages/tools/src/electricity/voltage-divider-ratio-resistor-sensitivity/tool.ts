import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly top: number;
  readonly bottom: number;
  readonly supply: number;
};
export type Output = {
  readonly topDerivative: number;
  readonly bottomDerivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    top: { type: "number", minimum: 0 },
    bottom: { type: "number", minimum: 0 },
    supply: { type: "number" },
  },
  required: ["top", "bottom", "supply"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topDerivative: { type: "number" },
    bottomDerivative: { type: "number" },
  },
  required: ["topDerivative", "bottomDerivative"],
} as const;
/** Differentiate ideal divider output supply*bottom/(top+bottom) with respect to both resistors. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { top, bottom, supply } = input;
  const compute = (): Output => {
    H.domain(top >= 0 && bottom >= 0 && top + bottom > 0);
    const d = (top + bottom) ** 2;
    return {
      topDerivative: (-supply * bottom) / d,
      bottomDerivative: (supply * top) / d,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { top: 1, bottom: 1, supply: 4 },
  output: { topDerivative: -1, bottomDerivative: 1 },
} satisfies ToolExample<Input, Output>;
export const voltageDividerRatioResistorSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electricity/voltage-divider-ratio-resistor-sensitivity",
      title: "Voltage Divider Ratio Resistor Sensitivity Tool",
      description:
        "Differentiate ideal divider output supply*bottom/(top+bottom) with respect to both resistors.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          top: { type: "number", minimum: 0 },
          bottom: { type: "number", minimum: 0 },
          supply: { type: "number" },
        },
        required: ["top", "bottom", "supply"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          topDerivative: { type: "number" },
          bottomDerivative: { type: "number" },
        },
        required: ["topDerivative", "bottomDerivative"],
      },
      ports: {
        inputs: [
          {
            id: "top",
            label: "Top",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "bottom",
            label: "Bottom",
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
            id: "topDerivative",
            label: "Top Derivative",
            valueType: { type: "number" },
          },
          {
            id: "bottomDerivative",
            label: "Bottom Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = voltageDividerRatioResistorSensitivityTool.execute;
export default voltageDividerRatioResistorSensitivityTool;

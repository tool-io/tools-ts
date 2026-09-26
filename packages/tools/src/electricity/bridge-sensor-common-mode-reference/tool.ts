import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly left: number;
  readonly right: number;
  readonly reference: number;
};
export type Output = {
  readonly differential: number;
  readonly commonMode: number;
  readonly centeredCommonMode: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "number" },
    right: { type: "number" },
    reference: { type: "number" },
  },
  required: ["left", "right", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    differential: { type: "number" },
    commonMode: { type: "number" },
    centeredCommonMode: { type: "number" },
  },
  required: ["differential", "commonMode", "centeredCommonMode"],
} as const;
/** Separate two bridge node voltages into differential and reference-centered common-mode components. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { left, right, reference } = input;
  const compute = (): Output => {
    const commonMode = (left + right) / 2;
    return {
      differential: left - right,
      commonMode,
      centeredCommonMode: commonMode - reference,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 5, right: 3, reference: 1 },
  output: { differential: 2, commonMode: 4, centeredCommonMode: 3 },
} satisfies ToolExample<Input, Output>;
export const bridgeSensorCommonModeReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/bridge-sensor-common-mode-reference",
    title: "Bridge Sensor Common Mode Reference Tool",
    description:
      "Separate two bridge node voltages into differential and reference-centered common-mode components.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        left: { type: "number" },
        right: { type: "number" },
        reference: { type: "number" },
      },
      required: ["left", "right", "reference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        differential: { type: "number" },
        commonMode: { type: "number" },
        centeredCommonMode: { type: "number" },
      },
      required: ["differential", "commonMode", "centeredCommonMode"],
    },
    ports: {
      inputs: [
        {
          id: "left",
          label: "Left",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "right",
          label: "Right",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "differential",
          label: "Differential",
          valueType: { type: "number" },
        },
        {
          id: "commonMode",
          label: "Common Mode",
          valueType: { type: "number" },
        },
        {
          id: "centeredCommonMode",
          label: "Centered Common Mode",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bridgeSensorCommonModeReferenceTool.execute;
export default bridgeSensorCommonModeReferenceTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredFlow: number;
  readonly suppliedZeroOffset: number;
  readonly scale: number;
};
export type Output = {
  readonly correctedFlow: number;
  readonly reversedSign: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredFlow: { type: "number" },
    suppliedZeroOffset: { type: "number" },
    scale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredFlow", "suppliedZeroOffset", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedFlow: { type: "number" },
    reversedSign: { type: "boolean" },
  },
  required: ["correctedFlow", "reversedSign"],
} as const;
/** Apply a supplied zero/scale calibration to a signed flow trace without clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredFlow, suppliedZeroOffset, scale } = request;
  const compute = (): Output => {
    H.positive(scale);
    return {
      correctedFlow: (measuredFlow - suppliedZeroOffset) * scale,
      reversedSign: measuredFlow * (measuredFlow - suppliedZeroOffset) < 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredFlow: 2, suppliedZeroOffset: 3, scale: 2 },
  output: { correctedFlow: -2, reversedSign: true },
} satisfies ToolExample<Input, Output>;
export const nasalFlowZeroOffsetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "otolaryngology/nasal-flow-zero-offset-term",
    title: "Nasal Flow Zero Offset Term Tool",
    description:
      "Apply a supplied zero/scale calibration to a signed flow trace without clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredFlow: { type: "number" },
        suppliedZeroOffset: { type: "number" },
        scale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredFlow", "suppliedZeroOffset", "scale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedFlow: { type: "number" },
        reversedSign: { type: "boolean" },
      },
      required: ["correctedFlow", "reversedSign"],
    },
    ports: {
      inputs: [
        {
          id: "measuredFlow",
          label: "Measured Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedZeroOffset",
          label: "Supplied Zero Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedFlow",
          label: "Corrected Flow",
          valueType: { type: "number" },
        },
        {
          id: "reversedSign",
          label: "Reversed Sign",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = nasalFlowZeroOffsetTermTool.execute;
export default nasalFlowZeroOffsetTermTool;

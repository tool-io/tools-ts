import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly valleyFloorWidth: number;
  readonly channelWidth: number;
};
export type Output = { readonly widthRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valleyFloorWidth: { type: "number", minimum: 0 },
    channelWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["valleyFloorWidth", "channelWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { widthRatio: { type: "number" } },
  required: ["widthRatio"],
} as const;
/** Divide supplied valley-floor width by positive channel width without assigning a confinement class. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { valleyFloorWidth, channelWidth } = request;
  const compute = (): Output => {
    H.domain(valleyFloorWidth >= 0, "valleyFloorWidth");
    (H.domain(
      Number.isFinite(channelWidth) && channelWidth > 0,
      "channelWidth",
    ),
      channelWidth);
    return { widthRatio: valleyFloorWidth / channelWidth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { valleyFloorWidth: 60, channelWidth: 20 },
  output: { widthRatio: 3 },
} satisfies ToolExample<Input, Output>;
export const valleyFloorConfinementWidthRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/valley-floor-confinement-width-ratio",
    title: "Valley Floor Confinement Width Ratio Tool",
    description:
      "Divide supplied valley-floor width by positive channel width without assigning a confinement class.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valleyFloorWidth: { type: "number", minimum: 0 },
        channelWidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["valleyFloorWidth", "channelWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { widthRatio: { type: "number" } },
      required: ["widthRatio"],
    },
    ports: {
      inputs: [
        {
          id: "valleyFloorWidth",
          label: "Valley Floor Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "channelWidth",
          label: "Channel Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "widthRatio",
          label: "Width Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = valleyFloorConfinementWidthRatioTool.execute;
export default valleyFloorConfinementWidthRatioTool;

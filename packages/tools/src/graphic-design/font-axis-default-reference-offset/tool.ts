import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly axisValue: number;
  readonly suppliedDefault: number;
  readonly suppliedScale: number;
};
export type Output = {
  readonly offset: number;
  readonly normalizedOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axisValue: { type: "number" },
    suppliedDefault: { type: "number" },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["axisValue", "suppliedDefault", "suppliedScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offset: { type: "number" },
    normalizedOffset: { type: "number" },
  },
  required: ["offset", "normalizedOffset"],
} as const;
/** Normalize one supplied font-axis value relative to an explicit default/scale, without loading a font. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { axisValue, suppliedDefault, suppliedScale } = request;
  const compute = (): Output => {
    H.positive(suppliedScale);
    return {
      offset: axisValue - suppliedDefault,
      normalizedOffset: (axisValue - suppliedDefault) / suppliedScale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { axisValue: 500, suppliedDefault: 400, suppliedScale: 100 },
  output: { offset: 100, normalizedOffset: 1 },
} satisfies ToolExample<Input, Output>;
export const fontAxisDefaultReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/font-axis-default-reference-offset",
    title: "Font Axis Default Reference Offset Tool",
    description:
      "Normalize one supplied font-axis value relative to an explicit default/scale, without loading a font.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        axisValue: { type: "number" },
        suppliedDefault: { type: "number" },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["axisValue", "suppliedDefault", "suppliedScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offset: { type: "number" },
        normalizedOffset: { type: "number" },
      },
      required: ["offset", "normalizedOffset"],
    },
    ports: {
      inputs: [
        {
          id: "axisValue",
          label: "Axis Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDefault",
          label: "Supplied Default",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
        {
          id: "normalizedOffset",
          label: "Normalized Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fontAxisDefaultReferenceOffsetTool.execute;
export default fontAxisDefaultReferenceOffsetTool;

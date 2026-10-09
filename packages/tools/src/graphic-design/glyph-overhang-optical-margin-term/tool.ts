import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly advanceWidth: number;
  readonly inkLeft: number;
  readonly inkRight: number;
};
export type Output = {
  readonly leftOverhang: number;
  readonly rightOverhang: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    advanceWidth: { type: "number", minimum: 0 },
    inkLeft: { type: "number" },
    inkRight: { type: "number" },
  },
  required: ["advanceWidth", "inkLeft", "inkRight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftOverhang: { type: "number" },
    rightOverhang: { type: "number" },
  },
  required: ["leftOverhang", "rightOverhang"],
} as const;
/** Calculate explicit glyph ink overhang beyond a zero-origin advance box without prescribing optical margin alignment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { advanceWidth, inkLeft, inkRight } = request;
  const compute = (): Output => {
    H.domain(advanceWidth >= 0, "advanceWidth");
    H.domain(inkRight >= inkLeft, "inkRight");
    return {
      leftOverhang: Math.max(0, -inkLeft),
      rightOverhang: Math.max(0, inkRight - advanceWidth),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { advanceWidth: 10, inkLeft: -2, inkRight: 12 },
  output: { leftOverhang: 2, rightOverhang: 2 },
} satisfies ToolExample<Input, Output>;
export const glyphOverhangOpticalMarginTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/glyph-overhang-optical-margin-term",
    title: "Glyph Overhang Optical Margin Term Tool",
    description:
      "Calculate explicit glyph ink overhang beyond a zero-origin advance box without prescribing optical margin alignment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        advanceWidth: { type: "number", minimum: 0 },
        inkLeft: { type: "number" },
        inkRight: { type: "number" },
      },
      required: ["advanceWidth", "inkLeft", "inkRight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftOverhang: { type: "number" },
        rightOverhang: { type: "number" },
      },
      required: ["leftOverhang", "rightOverhang"],
    },
    ports: {
      inputs: [
        {
          id: "advanceWidth",
          label: "Advance Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inkLeft",
          label: "Ink Left",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inkRight",
          label: "Ink Right",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "leftOverhang",
          label: "Left Overhang",
          valueType: { type: "number" },
        },
        {
          id: "rightOverhang",
          label: "Right Overhang",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = glyphOverhangOpticalMarginTermTool.execute;
export default glyphOverhangOpticalMarginTermTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly glyphAdvance: number;
  readonly leftOverhang: number;
  readonly rightOverhang: number;
  readonly marginFraction: number;
};
export type Output = {
  readonly leftShift: number;
  readonly rightShift: number;
  readonly effectiveWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    glyphAdvance: { type: "number", minimum: 0 },
    leftOverhang: { type: "number", minimum: 0 },
    rightOverhang: { type: "number", minimum: 0 },
    marginFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["glyphAdvance", "leftOverhang", "rightOverhang", "marginFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftShift: { type: "number" },
    rightShift: { type: "number" },
    effectiveWidth: { type: "number" },
  },
  required: ["leftShift", "rightShift", "effectiveWidth"],
} as const;
/** Explicit optical-edge offsets from supplied overhang measurements; no font-specific optical correction is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { glyphAdvance, leftOverhang, rightOverhang, marginFraction } = request;
  const compute = (): Output => {
    H.domain(glyphAdvance >= 0 && leftOverhang >= 0 && rightOverhang >= 0);
    H.probability(marginFraction);
    return {
      leftShift: -leftOverhang * marginFraction,
      rightShift: rightOverhang * marginFraction,
      effectiveWidth:
        glyphAdvance - (leftOverhang + rightOverhang) * marginFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    glyphAdvance: 20,
    leftOverhang: 2,
    rightOverhang: 3,
    marginFraction: 0.5,
  },
  output: { leftShift: -1, rightShift: 1.5, effectiveWidth: 17.5 },
} satisfies ToolExample<Input, Output>;
export const opticalMarginSuppliedGlyphOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/optical-margin-supplied-glyph-offset",
    title: "Optical Margin Supplied Glyph Offset Tool",
    description:
      "Explicit optical-edge offsets from supplied overhang measurements; no font-specific optical correction is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        glyphAdvance: { type: "number", minimum: 0 },
        leftOverhang: { type: "number", minimum: 0 },
        rightOverhang: { type: "number", minimum: 0 },
        marginFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "glyphAdvance",
        "leftOverhang",
        "rightOverhang",
        "marginFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftShift: { type: "number" },
        rightShift: { type: "number" },
        effectiveWidth: { type: "number" },
      },
      required: ["leftShift", "rightShift", "effectiveWidth"],
    },
    ports: {
      inputs: [
        {
          id: "glyphAdvance",
          label: "Glyph Advance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftOverhang",
          label: "Left Overhang",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightOverhang",
          label: "Right Overhang",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "marginFraction",
          label: "Margin Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "leftShift", label: "Left Shift", valueType: { type: "number" } },
        {
          id: "rightShift",
          label: "Right Shift",
          valueType: { type: "number" },
        },
        {
          id: "effectiveWidth",
          label: "Effective Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = opticalMarginSuppliedGlyphOffsetTool.execute;
export default opticalMarginSuppliedGlyphOffsetTool;

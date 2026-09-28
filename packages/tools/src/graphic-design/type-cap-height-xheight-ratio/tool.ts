import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capHeight: number;
  readonly xHeight: number;
  readonly unitsPerEm: number;
  readonly fontPixels: number;
};
export type Output = {
  readonly xCapRatio: number;
  readonly capPixels: number;
  readonly xPixels: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capHeight: { type: "number", exclusiveMinimum: 0 },
    xHeight: { type: "number", minimum: 0 },
    unitsPerEm: { type: "number", exclusiveMinimum: 0 },
    fontPixels: { type: "number", minimum: 0 },
  },
  required: ["capHeight", "xHeight", "unitsPerEm", "fontPixels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    xCapRatio: { type: "number" },
    capPixels: { type: "number" },
    xPixels: { type: "number" },
  },
  required: ["xCapRatio", "capPixels", "xPixels"],
} as const;
/** Calculate type cap height xheight ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capHeight, xHeight, unitsPerEm, fontPixels } = request;
  const compute = (): Output => {
    H.positive(capHeight);
    H.domain(xHeight >= 0 && fontPixels >= 0);
    H.positive(unitsPerEm);
    return {
      xCapRatio: xHeight / capHeight,
      capPixels: (capHeight * fontPixels) / unitsPerEm,
      xPixels: (xHeight * fontPixels) / unitsPerEm,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capHeight: 700, xHeight: 500, unitsPerEm: 1000, fontPixels: 20 },
  output: { xCapRatio: 0.7142857142857143, capPixels: 14, xPixels: 10 },
} satisfies ToolExample<Input, Output>;
export const typeCapHeightXheightRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/type-cap-height-xheight-ratio",
    title: "Type Cap Height Xheight Ratio Tool",
    description:
      "Calculate type cap height xheight ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capHeight: { type: "number", exclusiveMinimum: 0 },
        xHeight: { type: "number", minimum: 0 },
        unitsPerEm: { type: "number", exclusiveMinimum: 0 },
        fontPixels: { type: "number", minimum: 0 },
      },
      required: ["capHeight", "xHeight", "unitsPerEm", "fontPixels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        xCapRatio: { type: "number" },
        capPixels: { type: "number" },
        xPixels: { type: "number" },
      },
      required: ["xCapRatio", "capPixels", "xPixels"],
    },
    ports: {
      inputs: [
        {
          id: "capHeight",
          label: "Cap Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "xHeight",
          label: "X Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitsPerEm",
          label: "Units Per Em",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fontPixels",
          label: "Font Pixels",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "xCapRatio",
          label: "X Cap Ratio",
          valueType: { type: "number" },
        },
        { id: "capPixels", label: "Cap Pixels", valueType: { type: "number" } },
        { id: "xPixels", label: "X Pixels", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = typeCapHeightXheightRatioTool.execute;
export default typeCapHeightXheightRatioTool;

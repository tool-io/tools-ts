import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly selectorX: number;
  readonly selectorY: number;
  readonly referenceX: number;
  readonly referenceY: number;
  readonly sourceWidth: number;
  readonly sourceHeight: number;
};
export type Output = {
  readonly xFractionGap: number;
  readonly yFractionGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectorX: { type: "number" },
    selectorY: { type: "number" },
    referenceX: { type: "number" },
    referenceY: { type: "number" },
    sourceWidth: { type: "number", exclusiveMinimum: 0 },
    sourceHeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "selectorX",
    "selectorY",
    "referenceX",
    "referenceY",
    "sourceWidth",
    "sourceHeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    xFractionGap: { type: "number" },
    yFractionGap: { type: "number" },
  },
  required: ["xFractionGap", "yFractionGap"],
} as const;
/** Compare explicit pixel-region selector anchors on a supplied IIIF source grid; no request parsing or image access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    selectorX,
    selectorY,
    referenceX,
    referenceY,
    sourceWidth,
    sourceHeight,
  } = request;
  const compute = (): Output => {
    H.positive(sourceWidth);
    H.positive(sourceHeight);
    return {
      xFractionGap: (selectorX - referenceX) / sourceWidth,
      yFractionGap: (selectorY - referenceY) / sourceHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    selectorX: 20,
    selectorY: 30,
    referenceX: 10,
    referenceY: 10,
    sourceWidth: 100,
    sourceHeight: 200,
  },
  output: { xFractionGap: 0.1, yFractionGap: 0.1 },
} satisfies ToolExample<Input, Output>;
export const iiifSelectorReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/iiif-selector-reference-gap",
    title: "IIIF Selector Reference Gap Tool",
    description:
      "Compare explicit pixel-region selector anchors on a supplied IIIF source grid; no request parsing or image access.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selectorX: { type: "number" },
        selectorY: { type: "number" },
        referenceX: { type: "number" },
        referenceY: { type: "number" },
        sourceWidth: { type: "number", exclusiveMinimum: 0 },
        sourceHeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "selectorX",
        "selectorY",
        "referenceX",
        "referenceY",
        "sourceWidth",
        "sourceHeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        xFractionGap: { type: "number" },
        yFractionGap: { type: "number" },
      },
      required: ["xFractionGap", "yFractionGap"],
    },
    ports: {
      inputs: [
        {
          id: "selectorX",
          label: "Selector X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "selectorY",
          label: "Selector Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceX",
          label: "Reference X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceY",
          label: "Reference Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceWidth",
          label: "Source Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceHeight",
          label: "Source Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "xFractionGap",
          label: "X Fraction Gap",
          valueType: { type: "number" },
        },
        {
          id: "yFractionGap",
          label: "Y Fraction Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = iiifSelectorReferenceGapTool.execute;
export default iiifSelectorReferenceGapTool;

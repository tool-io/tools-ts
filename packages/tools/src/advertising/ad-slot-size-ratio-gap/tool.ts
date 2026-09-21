import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly creativeWidth: number;
  readonly creativeHeight: number;
  readonly slotWidth: number;
  readonly slotHeight: number;
};
export type Output = {
  readonly creativeRatio: number;
  readonly slotRatio: number;
  readonly ratioGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creativeWidth: { type: "number", exclusiveMinimum: 0 },
    creativeHeight: { type: "number", exclusiveMinimum: 0 },
    slotWidth: { type: "number", exclusiveMinimum: 0 },
    slotHeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["creativeWidth", "creativeHeight", "slotWidth", "slotHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creativeRatio: { type: "number" },
    slotRatio: { type: "number" },
    ratioGap: { type: "number" },
  },
  required: ["creativeRatio", "slotRatio", "ratioGap"],
} as const;
/** Calculate ad slot size ratio gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { creativeWidth, creativeHeight, slotWidth, slotHeight } = request;
  const compute = (): Output => {
    H.positive(creativeWidth);
    H.positive(creativeHeight);
    H.positive(slotWidth);
    H.positive(slotHeight);
    return {
      creativeRatio: creativeWidth / creativeHeight,
      slotRatio: slotWidth / slotHeight,
      ratioGap: creativeWidth / creativeHeight - slotWidth / slotHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { creativeWidth: 16, creativeHeight: 9, slotWidth: 4, slotHeight: 3 },
  output: {
    creativeRatio: 1.7777777777777777,
    slotRatio: 1.3333333333333333,
    ratioGap: 0.4444444444444444,
  },
} satisfies ToolExample<Input, Output>;
export const adSlotSizeRatioGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "advertising/ad-slot-size-ratio-gap",
    title: "Ad Slot Size Ratio Gap Tool",
    description:
      "Calculate ad slot size ratio gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creativeWidth: { type: "number", exclusiveMinimum: 0 },
        creativeHeight: { type: "number", exclusiveMinimum: 0 },
        slotWidth: { type: "number", exclusiveMinimum: 0 },
        slotHeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["creativeWidth", "creativeHeight", "slotWidth", "slotHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creativeRatio: { type: "number" },
        slotRatio: { type: "number" },
        ratioGap: { type: "number" },
      },
      required: ["creativeRatio", "slotRatio", "ratioGap"],
    },
    ports: {
      inputs: [
        {
          id: "creativeWidth",
          label: "Creative Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creativeHeight",
          label: "Creative Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slotWidth",
          label: "Slot Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slotHeight",
          label: "Slot Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "creativeRatio",
          label: "Creative Ratio",
          valueType: { type: "number" },
        },
        { id: "slotRatio", label: "Slot Ratio", valueType: { type: "number" } },
        { id: "ratioGap", label: "Ratio Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = adSlotSizeRatioGapTool.execute;
export default adSlotSizeRatioGapTool;

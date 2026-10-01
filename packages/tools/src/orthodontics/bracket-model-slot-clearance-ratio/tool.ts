import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slotHeight: number;
  readonly wireHeight: number;
  readonly slotWidth: number;
  readonly wireWidth: number;
};
export type Output = {
  readonly heightGap: number;
  readonly widthGap: number;
  readonly occupiedAreaFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slotHeight: { type: "number", exclusiveMinimum: 0 },
    wireHeight: { type: "number", minimum: 0 },
    slotWidth: { type: "number", exclusiveMinimum: 0 },
    wireWidth: { type: "number", minimum: 0 },
  },
  required: ["slotHeight", "wireHeight", "slotWidth", "wireWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heightGap: { type: "number" },
    widthGap: { type: "number" },
    occupiedAreaFraction: { type: "number" },
  },
  required: ["heightGap", "widthGap", "occupiedAreaFraction"],
} as const;
/** Calculate bracket model slot clearance ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slotHeight, wireHeight, slotWidth, wireWidth } = request;
  const compute = (): Output => {
    H.positive(slotHeight);
    H.positive(slotWidth);
    H.domain(wireHeight >= 0 && wireWidth >= 0);
    return {
      heightGap: slotHeight - wireHeight,
      widthGap: slotWidth - wireWidth,
      occupiedAreaFraction: (wireHeight * wireWidth) / (slotHeight * slotWidth),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { slotHeight: 2, wireHeight: 1.5, slotWidth: 3, wireWidth: 2 },
  output: { heightGap: 0.5, widthGap: 1, occupiedAreaFraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const bracketModelSlotClearanceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthodontics/bracket-model-slot-clearance-ratio",
    title: "Bracket Model Slot Clearance Ratio Tool",
    description:
      "Calculate bracket model slot clearance ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slotHeight: { type: "number", exclusiveMinimum: 0 },
        wireHeight: { type: "number", minimum: 0 },
        slotWidth: { type: "number", exclusiveMinimum: 0 },
        wireWidth: { type: "number", minimum: 0 },
      },
      required: ["slotHeight", "wireHeight", "slotWidth", "wireWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heightGap: { type: "number" },
        widthGap: { type: "number" },
        occupiedAreaFraction: { type: "number" },
      },
      required: ["heightGap", "widthGap", "occupiedAreaFraction"],
    },
    ports: {
      inputs: [
        {
          id: "slotHeight",
          label: "Slot Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wireHeight",
          label: "Wire Height",
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
          id: "wireWidth",
          label: "Wire Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "heightGap", label: "Height Gap", valueType: { type: "number" } },
        { id: "widthGap", label: "Width Gap", valueType: { type: "number" } },
        {
          id: "occupiedAreaFraction",
          label: "Occupied Area Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bracketModelSlotClearanceRatioTool.execute;
export default bracketModelSlotClearanceRatioTool;

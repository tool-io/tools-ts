import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capHeight: number;
  readonly lineHeight: number;
  readonly ascenderHeight: number;
  readonly descenderDepth: number;
};
export type Output = {
  readonly capShare: number;
  readonly occupiedHeight: number;
  readonly remainingLeading: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capHeight: { type: "number", minimum: 0 },
    lineHeight: { type: "number", exclusiveMinimum: 0 },
    ascenderHeight: { type: "number", minimum: 0 },
    descenderDepth: { type: "number", minimum: 0 },
  },
  required: ["capHeight", "lineHeight", "ascenderHeight", "descenderDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capShare: { type: "number" },
    occupiedHeight: { type: "number" },
    remainingLeading: { type: "number" },
  },
  required: ["capShare", "occupiedHeight", "remainingLeading"],
} as const;
/** Calculate type capheight lineheight share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capHeight, lineHeight, ascenderHeight, descenderDepth } = request;
  const compute = (): Output => {
    H.domain(capHeight >= 0 && ascenderHeight >= 0 && descenderDepth >= 0);
    H.positive(lineHeight);
    return {
      capShare: capHeight / lineHeight,
      occupiedHeight: ascenderHeight + descenderDepth,
      remainingLeading: lineHeight - ascenderHeight - descenderDepth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capHeight: 7, lineHeight: 12, ascenderHeight: 9, descenderDepth: 2 },
  output: {
    capShare: 0.5833333333333334,
    occupiedHeight: 11,
    remainingLeading: 1,
  },
} satisfies ToolExample<Input, Output>;
export const typeCapheightLineheightShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/type-capheight-lineheight-share",
    title: "Type Capheight Lineheight Share Tool",
    description:
      "Calculate type capheight lineheight share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capHeight: { type: "number", minimum: 0 },
        lineHeight: { type: "number", exclusiveMinimum: 0 },
        ascenderHeight: { type: "number", minimum: 0 },
        descenderDepth: { type: "number", minimum: 0 },
      },
      required: ["capHeight", "lineHeight", "ascenderHeight", "descenderDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capShare: { type: "number" },
        occupiedHeight: { type: "number" },
        remainingLeading: { type: "number" },
      },
      required: ["capShare", "occupiedHeight", "remainingLeading"],
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
          id: "lineHeight",
          label: "Line Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ascenderHeight",
          label: "Ascender Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "descenderDepth",
          label: "Descender Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "capShare", label: "Cap Share", valueType: { type: "number" } },
        {
          id: "occupiedHeight",
          label: "Occupied Height",
          valueType: { type: "number" },
        },
        {
          id: "remainingLeading",
          label: "Remaining Leading",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = typeCapheightLineheightShareTool.execute;
export default typeCapheightLineheightShareTool;

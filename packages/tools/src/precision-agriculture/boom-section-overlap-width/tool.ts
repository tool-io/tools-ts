import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftSectionEnd: number;
  readonly rightSectionStart: number;
};
export type Output = {
  readonly overlapWidth: number;
  readonly gapWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftSectionEnd: { type: "number" },
    rightSectionStart: { type: "number" },
  },
  required: ["leftSectionEnd", "rightSectionStart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapWidth: { type: "number" },
    gapWidth: { type: "number" },
  },
  required: ["overlapWidth", "gapWidth"],
} as const;
/** Compare explicit adjacent boom-section endpoints on a shared axis without configuring application equipment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftSectionEnd, rightSectionStart } = request;
  const compute = (): Output => {
    return {
      overlapWidth: Math.max(0, leftSectionEnd - rightSectionStart),
      gapWidth: Math.max(0, rightSectionStart - leftSectionEnd),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leftSectionEnd: 6, rightSectionStart: 5 },
  output: { overlapWidth: 1, gapWidth: 0 },
} satisfies ToolExample<Input, Output>;
export const boomSectionOverlapWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["precision-agriculture", "precision agriculture", "agriculture"],
      keywords: ["precision agriculture", "agriculture"],
    },
    id: "precision-agriculture/boom-section-overlap-width",
    title: "Boom Section Overlap Width",
    description:
      "Compare explicit adjacent boom-section endpoints on a shared axis without configuring application equipment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftSectionEnd: { type: "number" },
        rightSectionStart: { type: "number" },
      },
      required: ["leftSectionEnd", "rightSectionStart"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapWidth: { type: "number" },
        gapWidth: { type: "number" },
      },
      required: ["overlapWidth", "gapWidth"],
    },
    ports: {
      inputs: [
        {
          id: "leftSectionEnd",
          label: "Left Section End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightSectionStart",
          label: "Right Section Start",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapWidth",
          label: "Overlap Width",
          valueType: { type: "number" },
        },
        { id: "gapWidth", label: "Gap Width", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = boomSectionOverlapWidthTool.execute;
export default boomSectionOverlapWidthTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caption: string;
  readonly suppliedMinimum: number;
  readonly suppliedMaximum: number;
  readonly countCodePoints: boolean;
};
export type Output = {
  readonly length: number;
  readonly belowMinimum: number;
  readonly aboveMaximum: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caption: { type: "string", maxLength: 8192 },
    suppliedMinimum: { type: "integer", minimum: 0 },
    suppliedMaximum: { type: "integer" },
    countCodePoints: { type: "boolean" },
  },
  required: [
    "caption",
    "suppliedMinimum",
    "suppliedMaximum",
    "countCodePoints",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer" },
    belowMinimum: { type: "integer" },
    aboveMaximum: { type: "integer" },
  },
  required: ["length", "belowMinimum", "aboveMaximum"],
} as const;
/** Compare literal caption length in explicit UTF-16 units or code points; no grapheme or language inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caption, suppliedMinimum, suppliedMaximum, countCodePoints } =
    request;
  const compute = (): Output => {
    H.integer(suppliedMinimum, 0);
    H.integer(suppliedMaximum, suppliedMinimum);
    return (() => {
      const length = countCodePoints ? [...caption].length : caption.length;
      return {
        length,
        belowMinimum: Math.max(0, suppliedMinimum - length),
        aboveMaximum: Math.max(0, length - suppliedMaximum),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    caption: "A😀",
    suppliedMinimum: 3,
    suppliedMaximum: 5,
    countCodePoints: true,
  },
  output: { length: 2, belowMinimum: 1, aboveMaximum: 0 },
} satisfies ToolExample<Input, Output>;
export const studentArtCaptionLengthGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/student-art-caption-length-gap",
    title: "Student Art Caption Length Gap Tool",
    description:
      "Compare literal caption length in explicit UTF-16 units or code points; no grapheme or language inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caption: { type: "string", maxLength: 8192 },
        suppliedMinimum: { type: "integer", minimum: 0 },
        suppliedMaximum: { type: "integer" },
        countCodePoints: { type: "boolean" },
      },
      required: [
        "caption",
        "suppliedMinimum",
        "suppliedMaximum",
        "countCodePoints",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer" },
        belowMinimum: { type: "integer" },
        aboveMaximum: { type: "integer" },
      },
      required: ["length", "belowMinimum", "aboveMaximum"],
    },
    ports: {
      inputs: [
        {
          id: "caption",
          label: "Caption",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedMinimum",
          label: "Supplied Minimum",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedMaximum",
          label: "Supplied Maximum",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countCodePoints",
          label: "Count Code Points",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "length", label: "Length", valueType: { type: "integer" } },
        {
          id: "belowMinimum",
          label: "Below Minimum",
          valueType: { type: "integer" },
        },
        {
          id: "aboveMaximum",
          label: "Above Maximum",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = studentArtCaptionLengthGapTool.execute;
export default studentArtCaptionLengthGapTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stimulusStart: number;
  readonly stimulusEnd: number;
  readonly maskStart: number;
  readonly maskEnd: number;
  readonly validOverlapFraction: number;
};
export type Output = {
  readonly overlap: number;
  readonly validOverlap: number;
  readonly share: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stimulusStart: { type: "number" },
    stimulusEnd: { type: "number" },
    maskStart: { type: "number" },
    maskEnd: { type: "number" },
    validOverlapFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "stimulusStart",
    "stimulusEnd",
    "maskStart",
    "maskEnd",
    "validOverlapFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlap: { type: "number" },
    validOverlap: { type: "number" },
    share: { type: "number" },
  },
  required: ["overlap", "validOverlap", "share"],
} as const;
/** Calculate stimulus mask overlap share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    stimulusStart,
    stimulusEnd,
    maskStart,
    maskEnd,
    validOverlapFraction,
  } = request;
  const compute = (): Output => {
    H.domain(stimulusEnd > stimulusStart && maskEnd >= maskStart);
    H.probability(validOverlapFraction);
    return (() => {
      const overlap = Math.max(
          0,
          Math.min(stimulusEnd, maskEnd) - Math.max(stimulusStart, maskStart),
        ),
        validOverlap = overlap * validOverlapFraction;
      return {
        overlap,
        validOverlap,
        share: validOverlap / (stimulusEnd - stimulusStart),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stimulusStart: 0,
    stimulusEnd: 10,
    maskStart: 5,
    maskEnd: 15,
    validOverlapFraction: 0.8,
  },
  output: { overlap: 5, validOverlap: 4, share: 0.4 },
} satisfies ToolExample<Input, Output>;
export const stimulusMaskOverlapShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/stimulus-mask-overlap-share",
    title: "Stimulus Mask Overlap Share Tool",
    description:
      "Calculate stimulus mask overlap share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stimulusStart: { type: "number" },
        stimulusEnd: { type: "number" },
        maskStart: { type: "number" },
        maskEnd: { type: "number" },
        validOverlapFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "stimulusStart",
        "stimulusEnd",
        "maskStart",
        "maskEnd",
        "validOverlapFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlap: { type: "number" },
        validOverlap: { type: "number" },
        share: { type: "number" },
      },
      required: ["overlap", "validOverlap", "share"],
    },
    ports: {
      inputs: [
        {
          id: "stimulusStart",
          label: "Stimulus Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stimulusEnd",
          label: "Stimulus End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maskStart",
          label: "Mask Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maskEnd",
          label: "Mask End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "validOverlapFraction",
          label: "Valid Overlap Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
        {
          id: "validOverlap",
          label: "Valid Overlap",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = stimulusMaskOverlapShareTool.execute;
export default stimulusMaskOverlapShareTool;

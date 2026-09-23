import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chromStart: number;
  readonly chromEnd: number;
  readonly blockStart: number;
  readonly blockSize: number;
};
export type Output = {
  readonly absoluteStart: number;
  readonly absoluteEnd: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chromStart: { type: "integer", minimum: 0 },
    chromEnd: { type: "integer" },
    blockStart: { type: "integer", minimum: 0 },
    blockSize: { type: "integer", minimum: 0 },
  },
  required: ["chromStart", "chromEnd", "blockStart", "blockSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteStart: { type: "integer" },
    absoluteEnd: { type: "integer" },
  },
  required: ["absoluteStart", "absoluteEnd"],
} as const;
/** One BED12 block uses a zero-based offset relative to chromStart and a half-open absolute interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chromStart, chromEnd, blockStart, blockSize } = request;
  const compute = (): Output => {
    H.integer(chromStart, 0);
    H.integer(chromEnd, chromStart);
    H.integer(blockStart, 0);
    H.integer(blockSize, 0);
    H.domain(chromStart + blockStart + blockSize <= chromEnd);
    return {
      absoluteStart: chromStart + blockStart,
      absoluteEnd: chromStart + blockStart + blockSize,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { chromStart: 100, chromEnd: 200, blockStart: 20, blockSize: 30 },
  output: { absoluteStart: 120, absoluteEnd: 150 },
} satisfies ToolExample<Input, Output>;
export const bedTwelveBlockRelativeStartTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/bed-twelve-block-relative-start-term",
    title: "BED Twelve Block Relative Start Term Tool",
    description:
      "One BED12 block uses a zero-based offset relative to chromStart and a half-open absolute interval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chromStart: { type: "integer", minimum: 0 },
        chromEnd: { type: "integer" },
        blockStart: { type: "integer", minimum: 0 },
        blockSize: { type: "integer", minimum: 0 },
      },
      required: ["chromStart", "chromEnd", "blockStart", "blockSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absoluteStart: { type: "integer" },
        absoluteEnd: { type: "integer" },
      },
      required: ["absoluteStart", "absoluteEnd"],
    },
    ports: {
      inputs: [
        {
          id: "chromStart",
          label: "Chrom Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "chromEnd",
          label: "Chrom End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "blockStart",
          label: "Block Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "blockSize",
          label: "Block Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "absoluteStart",
          label: "Absolute Start",
          valueType: { type: "integer" },
        },
        {
          id: "absoluteEnd",
          label: "Absolute End",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = bedTwelveBlockRelativeStartTermTool.execute;
export default bedTwelveBlockRelativeStartTermTool;

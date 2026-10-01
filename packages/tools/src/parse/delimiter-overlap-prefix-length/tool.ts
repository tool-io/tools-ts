import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftDelimiter: string;
  readonly rightDelimiter: string;
};
export type Output = {
  readonly overlapLength: number;
  readonly overlap: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftDelimiter: { type: "string", maxLength: 8192 },
    rightDelimiter: { type: "string", maxLength: 8192 },
  },
  required: ["leftDelimiter", "rightDelimiter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapLength: { type: "integer" },
    overlap: { type: "string", maxLength: 8192 },
  },
  required: ["overlapLength", "overlap"],
} as const;
/** Find the longest suffix of one literal delimiter that is a prefix of the next, measured in UTF-16 units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftDelimiter, rightDelimiter } = request;
  const compute = (): Output => {
    let overlapLength = 0;
    for (
      let n = 1;
      n <= Math.min(leftDelimiter.length, rightDelimiter.length);
      n++
    )
      if (leftDelimiter.endsWith(rightDelimiter.slice(0, n))) overlapLength = n;
    return { overlapLength, overlap: rightDelimiter.slice(0, overlapLength) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leftDelimiter: "abcab", rightDelimiter: "abx" },
  output: { overlapLength: 2, overlap: "ab" },
} satisfies ToolExample<Input, Output>;
export const delimiterOverlapPrefixLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/delimiter-overlap-prefix-length",
    title: "Delimiter Overlap Prefix Length Tool",
    description:
      "Find the longest suffix of one literal delimiter that is a prefix of the next, measured in UTF-16 units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftDelimiter: { type: "string", maxLength: 8192 },
        rightDelimiter: { type: "string", maxLength: 8192 },
      },
      required: ["leftDelimiter", "rightDelimiter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapLength: { type: "integer" },
        overlap: { type: "string", maxLength: 8192 },
      },
      required: ["overlapLength", "overlap"],
    },
    ports: {
      inputs: [
        {
          id: "leftDelimiter",
          label: "Left Delimiter",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rightDelimiter",
          label: "Right Delimiter",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "overlapLength",
          label: "Overlap Length",
          valueType: { type: "integer" },
        },
        { id: "overlap", label: "Overlap", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = delimiterOverlapPrefixLengthTool.execute;
export default delimiterOverlapPrefixLengthTool;

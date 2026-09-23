import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lines: readonly string[];
  readonly headerPrefix: string;
};
export type Output = {
  readonly headerIndices: readonly number[];
  readonly blankIndices: readonly number[];
  readonly nonSequenceIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lines: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    headerPrefix: { type: "string", maxLength: 8192 },
  },
  required: ["lines", "headerPrefix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headerIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
    blankIndices: { type: "array", maxItems: 256, items: { type: "integer" } },
    nonSequenceIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["headerIndices", "blankIndices", "nonSequenceIndices"],
} as const;
/** Classify supplied FASTA-like lines under an explicit header prefix and alphabetic sequence subset; no biological alphabet validation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lines, headerPrefix } = request;
  const compute = (): Output => {
    H.domain(headerPrefix.length > 0);
    const headerIndices = lines.flatMap((x, i) =>
        x.startsWith(headerPrefix) ? [i] : [],
      ),
      blankIndices = lines.flatMap((x, i) => (x.length === 0 ? [i] : [])),
      nonSequenceIndices = lines.flatMap((x, i) =>
        !x.startsWith(headerPrefix) &&
        x.length > 0 &&
        !/^[A-Za-z*.-]+(?![\s\S])/.test(x)
          ? [i]
          : [],
      );
    return { headerIndices, blankIndices, nonSequenceIndices };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lines: [">id", "ACGT", "", "note 1"], headerPrefix: ">" },
  output: { headerIndices: [0], blankIndices: [2], nonSequenceIndices: [3] },
} satisfies ToolExample<Input, Output>;
export const fastaNonSequenceLabelGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/fasta-non-sequence-label-gap",
    title: "FASTA Non Sequence Label Gap Tool",
    description:
      "Classify supplied FASTA-like lines under an explicit header prefix and alphabetic sequence subset; no biological alphabet validation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lines: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        headerPrefix: { type: "string", maxLength: 8192 },
      },
      required: ["lines", "headerPrefix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headerIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        blankIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        nonSequenceIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["headerIndices", "blankIndices", "nonSequenceIndices"],
    },
    ports: {
      inputs: [
        {
          id: "lines",
          label: "Lines",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "headerPrefix",
          label: "Header Prefix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "headerIndices",
          label: "Header Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "blankIndices",
          label: "Blank Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "nonSequenceIndices",
          label: "Non Sequence Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = fastaNonSequenceLabelGapTool.execute;
export default fastaNonSequenceLabelGapTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly anchorIds: readonly string[];
  readonly offsets: readonly number[];
  readonly startAnchor: string;
  readonly endAnchor: string;
  readonly includeEndUnit: boolean;
};
export type Output = {
  readonly length: number;
  readonly startOffset: number;
  readonly endOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    anchorIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    offsets: { type: "array", maxItems: 256, items: { type: "integer" } },
    startAnchor: { type: "string", maxLength: 8192 },
    endAnchor: { type: "string", maxLength: 8192 },
    includeEndUnit: { type: "boolean" },
  },
  required: [
    "anchorIds",
    "offsets",
    "startAnchor",
    "endAnchor",
    "includeEndUnit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer" },
    startOffset: { type: "integer" },
    endOffset: { type: "integer" },
  },
  required: ["length", "startOffset", "endOffset"],
} as const;
/** Resolve a supplied TEI anchor-offset range in one explicit counting unit without parsing XML. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { anchorIds, offsets, startAnchor, endAnchor, includeEndUnit } =
    request;
  const compute = (): Output => {
    H.sameLength(anchorIds, offsets);
    H.domain(
      new Set(anchorIds).size === anchorIds.length &&
        offsets.every((x, i) => x >= 0 && (i === 0 || x >= offsets[i - 1])),
    );
    const a = anchorIds.indexOf(startAnchor),
      b = anchorIds.indexOf(endAnchor);
    H.domain(a >= 0 && b >= a);
    return {
      length: offsets[b] - offsets[a] + (includeEndUnit ? 1 : 0),
      startOffset: offsets[a],
      endOffset: offsets[b],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    anchorIds: ["a", "b", "c"],
    offsets: [0, 10, 20],
    startAnchor: "a",
    endAnchor: "c",
    includeEndUnit: false,
  },
  output: { length: 20, startOffset: 0, endOffset: 20 },
} satisfies ToolExample<Input, Output>;
export const teiAnchorRangeLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "digital-humanities/tei-anchor-range-length",
    title: "TEI Anchor Range Length Tool",
    description:
      "Resolve a supplied TEI anchor-offset range in one explicit counting unit without parsing XML.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        anchorIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        offsets: { type: "array", maxItems: 256, items: { type: "integer" } },
        startAnchor: { type: "string", maxLength: 8192 },
        endAnchor: { type: "string", maxLength: 8192 },
        includeEndUnit: { type: "boolean" },
      },
      required: [
        "anchorIds",
        "offsets",
        "startAnchor",
        "endAnchor",
        "includeEndUnit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer" },
        startOffset: { type: "integer" },
        endOffset: { type: "integer" },
      },
      required: ["length", "startOffset", "endOffset"],
    },
    ports: {
      inputs: [
        {
          id: "anchorIds",
          label: "Anchor Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "offsets",
          label: "Offsets",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "startAnchor",
          label: "Start Anchor",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "endAnchor",
          label: "End Anchor",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "includeEndUnit",
          label: "Include End Unit",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "length", label: "Length", valueType: { type: "integer" } },
        {
          id: "startOffset",
          label: "Start Offset",
          valueType: { type: "integer" },
        },
        {
          id: "endOffset",
          label: "End Offset",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = teiAnchorRangeLengthTool.execute;
export default teiAnchorRangeLengthTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
import { utf8Encode } from "../../core/encoding.js";
export type Input = {
  readonly morphemes: readonly string[];
  readonly boundaryIndex: number;
};
export type Output = {
  readonly utf8ByteOffset: number;
  readonly precedingMorphemeCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    morphemes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    boundaryIndex: { type: "integer", minimum: 0 },
  },
  required: ["morphemes", "boundaryIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    utf8ByteOffset: { type: "integer" },
    precedingMorphemeCount: { type: "integer" },
  },
  required: ["utf8ByteOffset", "precedingMorphemeCount"],
} as const;
/** Count UTF-8 bytes preceding an explicit morpheme boundary, requiring each morpheme to contain complete Unicode scalar values; the terminal boundary is allowed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { morphemes, boundaryIndex } = request;
  const compute = (): Output => {
    for (const morpheme of morphemes)
      for (const character of morpheme) {
        const point = character.codePointAt(0);
        H.domain(
          point !== undefined && (point < 0xd800 || point > 0xdfff),
          "morphemes",
        );
      }
    (H.domain(
      Number.isSafeInteger(boundaryIndex) &&
        boundaryIndex >= 0 &&
        boundaryIndex <= morphemes.length,
      "boundaryIndex",
    ),
      boundaryIndex);
    const prefix = morphemes.slice(0, boundaryIndex).join("");
    return {
      utf8ByteOffset: utf8Encode(prefix).length,
      precedingMorphemeCount: boundaryIndex,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { morphemes: ["un", "café", "s"], boundaryIndex: 2 },
  output: { utf8ByteOffset: 7, precedingMorphemeCount: 2 },
} satisfies ToolExample<Input, Output>;
export const morphemeBoundaryByteOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "computational-linguistics",
        "computational linguistics",
        "information and language sciences",
      ],
      keywords: [
        "computational linguistics",
        "information and language sciences",
      ],
    },
    id: "computational-linguistics/morpheme-boundary-byte-offset",
    title: "Morpheme Boundary Byte Offset",
    description:
      "Count UTF-8 bytes preceding an explicit morpheme boundary, requiring each morpheme to contain complete Unicode scalar values; the terminal boundary is allowed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        morphemes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        boundaryIndex: { type: "integer", minimum: 0 },
      },
      required: ["morphemes", "boundaryIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        utf8ByteOffset: { type: "integer" },
        precedingMorphemeCount: { type: "integer" },
      },
      required: ["utf8ByteOffset", "precedingMorphemeCount"],
    },
    ports: {
      inputs: [
        {
          id: "morphemes",
          label: "Morphemes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "boundaryIndex",
          label: "Boundary Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "utf8ByteOffset",
          label: "Utf8Byte Offset",
          valueType: { type: "integer" },
        },
        {
          id: "precedingMorphemeCount",
          label: "Preceding Morpheme Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = morphemeBoundaryByteOffsetTool.execute;
export default morphemeBoundaryByteOffsetTool;

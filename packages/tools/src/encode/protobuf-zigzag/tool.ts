import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ProtobufZigzagEncodeInput = { readonly values: readonly number[] };
export type ProtobufZigzagEncodeOutput = { readonly codes: readonly number[] };

export const protobufZigzagEncodeExample = {
  input: { values: [0, -1, 1, -64] },
  output: { codes: [0, 1, 2, 127] },
} satisfies ToolExample<ProtobufZigzagEncodeInput, ProtobufZigzagEncodeOutput>;

export const protobufZigzagEncodeTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ values }) => {
      const xs = values as unknown[];
      if (!Array.isArray(xs))
        simpleError("values", "Provide a list of integers.");
      return {
        codes: (xs as number[]).map((n) => {
          if (!Number.isSafeInteger(n) || Math.abs(n) > 4_503_599_627_370_495)
            simpleError(
              "values",
              "Every value must be an integer whose ZigZag code remains a safe integer.",
            );
          return n >= 0 ? n * 2 : -n * 2 - 1;
        }),
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Encode integers with the zigzag mapping: n≥0 → 2n, n<0 → −2n−1.",
  id: "encode/protobuf-zigzag",
  inputs: [
    {
      description: "Integers to encode.",
      id: "values",
      kind: "numberList",
      label: "values",
    },
  ],
  outputs: [
    {
      description: "Zigzag codes (non-negative).",
      id: "codes",
      kind: "numberList",
      label: "codes",
    },
  ],
  title: "Zigzag Integer Encoder",
});
export const runProtobufZigzagEncode = protobufZigzagEncodeTool.execute;
export { protobufZigzagEncodeExample as example };
export default protobufZigzagEncodeTool;

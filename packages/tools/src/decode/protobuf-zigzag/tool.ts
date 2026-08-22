import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ProtobufZigzagDecodeInput = { readonly codes: readonly number[] };
export type ProtobufZigzagDecodeOutput = {
  readonly negativeCount: number;
  readonly values: readonly number[];
};

export const protobufZigzagDecodeExample = {
  input: { codes: [0, 1, 2, 3] },
  output: { values: [0, -1, 1, -2], negativeCount: 2 },
} satisfies ToolExample<ProtobufZigzagDecodeInput, ProtobufZigzagDecodeOutput>;

export const protobufZigzagDecodeTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ codes }) => {
      const xs = codes as unknown[];
      if (!Array.isArray(xs) || xs.length === 0)
        simpleError("codes", "Provide codes.");
      let negativeCount = 0;
      const values = (xs as number[]).map((z) => {
        if (!Number.isSafeInteger(z) || z < 0)
          simpleError(
            "codes",
            "ZigZag codes must be non-negative safe integers.",
          );
        const v = z % 2 === 0 ? z / 2 : -((z + 1) / 2);
        if (v < 0) negativeCount++;
        return v;
      });
      return { values, negativeCount };
    })(input as never) as Record<string, unknown>,
  description: "Decode zigzag (Protobuf varint signed) codes back to integers.",
  id: "decode/protobuf-zigzag",
  inputs: [
    {
      description: "Non-negative zigzag codes.",
      id: "codes",
      kind: "numberList",
      label: "codes",
    },
  ],
  outputs: [
    {
      description: "Signed decoded integers.",
      id: "values",
      kind: "numberList",
      label: "values",
    },
    {
      description: "Number of negative values.",
      id: "negativeCount",
      kind: "integer",
      label: "n_neg",
    },
  ],
  title: "Zigzag Integer Decoder",
});
export const runProtobufZigzagDecode = protobufZigzagDecodeTool.execute;
export { protobufZigzagDecodeExample as example };
export default protobufZigzagDecodeTool;

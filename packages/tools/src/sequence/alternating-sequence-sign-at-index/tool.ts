import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly index: number;
  readonly referenceIndex: number;
  readonly referenceSign: number;
};
export type Output = { readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer" },
    referenceIndex: { type: "integer" },
    referenceSign: { type: "integer" },
  },
  required: ["index", "referenceIndex", "referenceSign"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sign: { type: "integer" } },
  required: ["sign"],
} as const;
/** Shift an explicit alternating sequence sign by the exact parity of a signed index difference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { index, referenceIndex, referenceSign } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(index) &&
        index >= -Number.MAX_SAFE_INTEGER &&
        index <= Number.MAX_SAFE_INTEGER,
      "index",
    ),
      index);
    (H.domain(
      Number.isSafeInteger(referenceIndex) &&
        referenceIndex >= -Number.MAX_SAFE_INTEGER &&
        referenceIndex <= Number.MAX_SAFE_INTEGER,
      "referenceIndex",
    ),
      referenceIndex);
    H.domain(referenceSign === -1 || referenceSign === 1, "referenceSign");
    return {
      sign:
        (BigInt(index) - BigInt(referenceIndex)) % 2n === 0n
          ? referenceSign
          : -referenceSign,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { index: 5, referenceIndex: 2, referenceSign: 1 },
  output: { sign: -1 },
} satisfies ToolExample<Input, Output>;
export const alternatingSequenceSignAtIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["sequence", "mathematics"],
      keywords: ["sequence", "mathematics"],
    },
    id: "sequence/alternating-sequence-sign-at-index",
    title: "Alternating Sequence Sign At Index",
    description:
      "Shift an explicit alternating sequence sign by the exact parity of a signed index difference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        index: { type: "integer" },
        referenceIndex: { type: "integer" },
        referenceSign: { type: "integer" },
      },
      required: ["index", "referenceIndex", "referenceSign"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sign: { type: "integer" } },
      required: ["sign"],
    },
    ports: {
      inputs: [
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceIndex",
          label: "Reference Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "referenceSign",
          label: "Reference Sign",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "sign", label: "Sign", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = alternatingSequenceSignAtIndexTool.execute;
export default alternatingSequenceSignAtIndexTool;

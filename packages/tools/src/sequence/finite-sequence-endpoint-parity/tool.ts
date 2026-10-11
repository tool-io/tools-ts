import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly startIndex: number; readonly endIndex: number };
export type Output = {
  readonly sameParity: boolean;
  readonly inclusiveTermCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startIndex: { type: "integer" },
    endIndex: { type: "integer" },
  },
  required: ["startIndex", "endIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameParity: { type: "boolean" },
    inclusiveTermCount: { type: "integer" },
  },
  required: ["sameParity", "inclusiveTermCount"],
} as const;
/** Compare explicit inclusive integer sequence endpoint parity and count terms with exact index arithmetic. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startIndex, endIndex } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(startIndex) &&
        startIndex >= -Number.MAX_SAFE_INTEGER &&
        startIndex <= Number.MAX_SAFE_INTEGER,
      "startIndex",
    ),
      startIndex);
    (H.domain(
      Number.isSafeInteger(endIndex) &&
        endIndex >= startIndex &&
        endIndex <= Number.MAX_SAFE_INTEGER,
      "endIndex",
    ),
      endIndex);
    return {
      sameParity: (BigInt(endIndex) - BigInt(startIndex)) % 2n === 0n,
      inclusiveTermCount: Number(BigInt(endIndex) - BigInt(startIndex) + 1n),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startIndex: 2, endIndex: 6 },
  output: { sameParity: true, inclusiveTermCount: 5 },
} satisfies ToolExample<Input, Output>;
export const finiteSequenceEndpointParityTool = H.defineSchemaCalculation<
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
    id: "sequence/finite-sequence-endpoint-parity",
    title: "Finite Sequence Endpoint Parity",
    description:
      "Compare explicit inclusive integer sequence endpoint parity and count terms with exact index arithmetic.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startIndex: { type: "integer" },
        endIndex: { type: "integer" },
      },
      required: ["startIndex", "endIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameParity: { type: "boolean" },
        inclusiveTermCount: { type: "integer" },
      },
      required: ["sameParity", "inclusiveTermCount"],
    },
    ports: {
      inputs: [
        {
          id: "startIndex",
          label: "Start Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endIndex",
          label: "End Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "sameParity",
          label: "Same Parity",
          valueType: { type: "boolean" },
        },
        {
          id: "inclusiveTermCount",
          label: "Inclusive Term Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = finiteSequenceEndpointParityTool.execute;
export default finiteSequenceEndpointParityTool;

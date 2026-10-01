import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly offsetUnits: number;
  readonly payloadBytes: number;
  readonly moreFragments: boolean;
};
export type Output = {
  readonly endExclusive: number;
  readonly lengthAligned: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    offsetUnits: { type: "integer", minimum: 0, maximum: 8191 },
    payloadBytes: { type: "integer", minimum: 0, maximum: 65515 },
    moreFragments: { type: "boolean" },
  },
  required: ["offsetUnits", "payloadBytes", "moreFragments"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endExclusive: { type: "integer" },
    lengthAligned: { type: "boolean" },
  },
  required: ["endExclusive", "lengthAligned"],
} as const;
/** Calculate ipv4 fragment last payload boundary from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { offsetUnits, payloadBytes, moreFragments } = request;
  const compute = (): Output => {
    H.integer(offsetUnits, 0, 8191);
    H.integer(payloadBytes, 0, 65515);
    const endExclusive = offsetUnits * 8 + payloadBytes;
    H.domain(endExclusive <= 65515);
    return {
      endExclusive,
      lengthAligned: !moreFragments || payloadBytes % 8 === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { offsetUnits: 3, payloadBytes: 10, moreFragments: false },
  output: { endExclusive: 34, lengthAligned: true },
} satisfies ToolExample<Input, Output>;
export const ipv4FragmentLastPayloadBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/ipv4-fragment-last-payload-boundary",
    title: "IPv4 Fragment Last Payload Boundary Tool",
    description:
      "Calculate ipv4 fragment last payload boundary from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        offsetUnits: { type: "integer", minimum: 0, maximum: 8191 },
        payloadBytes: { type: "integer", minimum: 0, maximum: 65515 },
        moreFragments: { type: "boolean" },
      },
      required: ["offsetUnits", "payloadBytes", "moreFragments"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        endExclusive: { type: "integer" },
        lengthAligned: { type: "boolean" },
      },
      required: ["endExclusive", "lengthAligned"],
    },
    ports: {
      inputs: [
        {
          id: "offsetUnits",
          label: "Offset Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "payloadBytes",
          label: "Payload Bytes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "moreFragments",
          label: "More Fragments",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "endExclusive",
          label: "End Exclusive",
          valueType: { type: "integer" },
        },
        {
          id: "lengthAligned",
          label: "Length Aligned",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = ipv4FragmentLastPayloadBoundaryTool.execute;
export default ipv4FragmentLastPayloadBoundaryTool;

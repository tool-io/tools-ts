import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStart: number;
  readonly firstLength: number;
  readonly secondStart: number;
  readonly secondLength: number;
};
export type Output = {
  readonly overlapBytes: number;
  readonly secondOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStart: { type: "integer", minimum: 0, maximum: 4294967295 },
    firstLength: { type: "integer", minimum: 0, maximum: 2147483647 },
    secondStart: { type: "integer", minimum: 0, maximum: 4294967295 },
    secondLength: { type: "integer", minimum: 0, maximum: 2147483647 },
  },
  required: ["firstStart", "firstLength", "secondStart", "secondLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapBytes: { type: "integer" },
    secondOffset: { type: "integer" },
  },
  required: ["overlapBytes", "secondOffset"],
} as const;
/** Overlap of two short TCP sequence intervals under a supplied common epoch, excluding an ambiguous half-space offset. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStart, firstLength, secondStart, secondLength } = request;
  const compute = (): Output => {
    H.integer(firstStart, 0, 4294967295);
    H.integer(secondStart, 0, 4294967295);
    H.integer(firstLength, 0, 2147483647);
    H.integer(secondLength, 0, 2147483647);
    const raw = secondStart - firstStart,
      secondOffset =
        raw >= 2147483648
          ? raw - 4294967296
          : raw < -2147483648
            ? raw + 4294967296
            : raw;
    H.domain(secondOffset !== -2147483648);
    return {
      overlapBytes: Math.max(
        0,
        Math.min(firstLength, secondOffset + secondLength) -
          Math.max(0, secondOffset),
      ),
      secondOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstStart: 4294967290,
    firstLength: 10,
    secondStart: 0,
    secondLength: 8,
  },
  output: { overlapBytes: 4, secondOffset: 6 },
} satisfies ToolExample<Input, Output>;
export const tcpRetransmissionSequenceOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/tcp-retransmission-sequence-overlap",
    title: "TCP Retransmission Sequence Overlap Tool",
    description:
      "Overlap of two short TCP sequence intervals under a supplied common epoch, excluding an ambiguous half-space offset.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStart: { type: "integer", minimum: 0, maximum: 4294967295 },
        firstLength: { type: "integer", minimum: 0, maximum: 2147483647 },
        secondStart: { type: "integer", minimum: 0, maximum: 4294967295 },
        secondLength: { type: "integer", minimum: 0, maximum: 2147483647 },
      },
      required: ["firstStart", "firstLength", "secondStart", "secondLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapBytes: { type: "integer" },
        secondOffset: { type: "integer" },
      },
      required: ["overlapBytes", "secondOffset"],
    },
    ports: {
      inputs: [
        {
          id: "firstStart",
          label: "First Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstLength",
          label: "First Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondStart",
          label: "Second Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondLength",
          label: "Second Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "overlapBytes",
          label: "Overlap Bytes",
          valueType: { type: "integer" },
        },
        {
          id: "secondOffset",
          label: "Second Offset",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = tcpRetransmissionSequenceOverlapTool.execute;
export default tcpRetransmissionSequenceOverlapTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLeft: number;
  readonly firstRight: number;
  readonly cumulativeAck: number;
};
export type Output = {
  readonly belowAck: boolean;
  readonly validBlock: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLeft: { type: "integer" },
    firstRight: { type: "integer" },
    cumulativeAck: { type: "integer" },
  },
  required: ["firstLeft", "firstRight", "cumulativeAck"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    belowAck: { type: "boolean" },
    validBlock: { type: "boolean" },
  },
  required: ["belowAck", "validBlock"],
} as const;
/** Classify only a first SACK block wholly below cumulative ACK under half-range serial arithmetic; containment D-SACK cases require other blocks. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLeft, firstRight, cumulativeAck } = request;
  const compute = (): Output => {
    for (const x of [firstLeft, firstRight, cumulativeAck])
      H.integer(x, 0, 4294967295);
    const span = H.mod(firstRight - firstLeft, 4294967296),
      back = H.mod(cumulativeAck - firstRight, 4294967296);
    const validBlock = span > 0 && span < 2147483648;
    return {
      belowAck: validBlock && back < 2147483648 && back + span < 2147483648,
      validBlock,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstLeft: 100, firstRight: 120, cumulativeAck: 150 },
  output: { belowAck: true, validBlock: true },
} satisfies ToolExample<Input, Output>;
export const tcpSackDuplicateBlockOrderClassifierTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "network/tcp-sack-duplicate-block-order-classifier",
      title: "TCP Sack Duplicate Block Order Classifier Tool",
      description:
        "Classify only a first SACK block wholly below cumulative ACK under half-range serial arithmetic; containment D-SACK cases require other blocks.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstLeft: { type: "integer" },
          firstRight: { type: "integer" },
          cumulativeAck: { type: "integer" },
        },
        required: ["firstLeft", "firstRight", "cumulativeAck"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          belowAck: { type: "boolean" },
          validBlock: { type: "boolean" },
        },
        required: ["belowAck", "validBlock"],
      },
      ports: {
        inputs: [
          {
            id: "firstLeft",
            label: "First Left",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "firstRight",
            label: "First Right",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "cumulativeAck",
            label: "Cumulative Ack",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "belowAck",
            label: "Below Ack",
            valueType: { type: "boolean" },
          },
          {
            id: "validBlock",
            label: "Valid Block",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = tcpSackDuplicateBlockOrderClassifierTool.execute;
export default tcpSackDuplicateBlockOrderClassifierTool;

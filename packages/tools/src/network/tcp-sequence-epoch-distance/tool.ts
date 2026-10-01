import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEpoch: string;
  readonly firstSequence: number;
  readonly secondEpoch: string;
  readonly secondSequence: number;
};
export type Output = { readonly distanceDecimal: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEpoch: { type: "string", maxLength: 8192, format: "integer-decimal" },
    firstSequence: { type: "integer", minimum: 0, maximum: 4294967295 },
    secondEpoch: { type: "string", maxLength: 8192, format: "integer-decimal" },
    secondSequence: { type: "integer", minimum: 0, maximum: 4294967295 },
  },
  required: ["firstEpoch", "firstSequence", "secondEpoch", "secondSequence"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distanceDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["distanceDecimal"],
} as const;
/** Compare explicitly unwrapped TCP epochs and unsigned sequence words; epochs are supplied, never inferred from serial ordering. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstEpoch, firstSequence, secondEpoch, secondSequence } = request;
  const compute = (): Output => {
    H.integer(firstSequence, 0, 4294967295);
    H.integer(secondSequence, 0, 4294967295);
    return {
      distanceDecimal: (
        (H.decimal(secondEpoch) - H.decimal(firstEpoch)) * 4294967296n +
        BigInt(secondSequence) -
        BigInt(firstSequence)
      ).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstEpoch: "2",
    firstSequence: 4294967290,
    secondEpoch: "3",
    secondSequence: 4,
  },
  output: { distanceDecimal: "10" },
} satisfies ToolExample<Input, Output>;
export const tcpSequenceEpochDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/tcp-sequence-epoch-distance",
    title: "TCP Sequence Epoch Distance Tool",
    description:
      "Compare explicitly unwrapped TCP epochs and unsigned sequence words; epochs are supplied, never inferred from serial ordering.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstEpoch: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        firstSequence: { type: "integer", minimum: 0, maximum: 4294967295 },
        secondEpoch: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        secondSequence: { type: "integer", minimum: 0, maximum: 4294967295 },
      },
      required: [
        "firstEpoch",
        "firstSequence",
        "secondEpoch",
        "secondSequence",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distanceDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["distanceDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "firstEpoch",
          label: "First Epoch",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "firstSequence",
          label: "First Sequence",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondEpoch",
          label: "Second Epoch",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "secondSequence",
          label: "Second Sequence",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "distanceDecimal",
          label: "Distance Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = tcpSequenceEpochDistanceTool.execute;
export default tcpSequenceEpochDistanceTool;

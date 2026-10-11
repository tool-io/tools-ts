import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTimestampSeconds: number;
  readonly secondTimestampSeconds: number;
  readonly suppliedSecondClockOffset: number;
};
export type Output = {
  readonly normalizedSecondSeconds: number;
  readonly signedGapSeconds: number;
  readonly ordered: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTimestampSeconds: { type: "number" },
    secondTimestampSeconds: { type: "number" },
    suppliedSecondClockOffset: { type: "number" },
  },
  required: [
    "firstTimestampSeconds",
    "secondTimestampSeconds",
    "suppliedSecondClockOffset",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedSecondSeconds: { type: "number" },
    signedGapSeconds: { type: "number" },
    ordered: { type: "boolean" },
  },
  required: ["normalizedSecondSeconds", "signedGapSeconds", "ordered"],
} as const;
/** Compare explicit defensive-log timestamps after a supplied second-clock offset without accessing systems or attributing activity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstTimestampSeconds,
    secondTimestampSeconds,
    suppliedSecondClockOffset,
  } = request;
  const compute = (): Output => {
    return {
      normalizedSecondSeconds:
        secondTimestampSeconds - suppliedSecondClockOffset,
      signedGapSeconds:
        secondTimestampSeconds -
        suppliedSecondClockOffset -
        firstTimestampSeconds,
      ordered:
        secondTimestampSeconds - suppliedSecondClockOffset >=
        firstTimestampSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstTimestampSeconds: 100,
    secondTimestampSeconds: 115,
    suppliedSecondClockOffset: 5,
  },
  output: { normalizedSecondSeconds: 110, signedGapSeconds: 10, ordered: true },
} satisfies ToolExample<Input, Output>;
export const defensiveLogClockOrderPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["security-studies", "security studies", "social sciences"],
      keywords: ["security studies", "social sciences"],
    },
    id: "security-studies/defensive-log-clock-order-pair",
    title: "Defensive Log Clock Order Pair",
    description:
      "Compare explicit defensive-log timestamps after a supplied second-clock offset without accessing systems or attributing activity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTimestampSeconds: { type: "number" },
        secondTimestampSeconds: { type: "number" },
        suppliedSecondClockOffset: { type: "number" },
      },
      required: [
        "firstTimestampSeconds",
        "secondTimestampSeconds",
        "suppliedSecondClockOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedSecondSeconds: { type: "number" },
        signedGapSeconds: { type: "number" },
        ordered: { type: "boolean" },
      },
      required: ["normalizedSecondSeconds", "signedGapSeconds", "ordered"],
    },
    ports: {
      inputs: [
        {
          id: "firstTimestampSeconds",
          label: "First Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondTimestampSeconds",
          label: "Second Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSecondClockOffset",
          label: "Supplied Second Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedSecondSeconds",
          label: "Normalized Second Seconds",
          valueType: { type: "number" },
        },
        {
          id: "signedGapSeconds",
          label: "Signed Gap Seconds",
          valueType: { type: "number" },
        },
        { id: "ordered", label: "Ordered", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = defensiveLogClockOrderPairTool.execute;
export default defensiveLogClockOrderPairTool;

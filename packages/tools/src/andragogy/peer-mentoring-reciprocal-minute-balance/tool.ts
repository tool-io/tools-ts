import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstProvided: number;
  readonly firstReceived: number;
  readonly secondProvided: number;
  readonly secondReceived: number;
};
export type Output = {
  readonly firstBalance: number;
  readonly secondBalance: number;
  readonly accountedGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstProvided: { type: "number", minimum: 0 },
    firstReceived: { type: "number", minimum: 0 },
    secondProvided: { type: "number", minimum: 0 },
    secondReceived: { type: "number", minimum: 0 },
  },
  required: [
    "firstProvided",
    "firstReceived",
    "secondProvided",
    "secondReceived",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstBalance: { type: "number" },
    secondBalance: { type: "number" },
    accountedGap: { type: "number" },
  },
  required: ["firstBalance", "secondBalance", "accountedGap"],
} as const;
/** Calculate peer mentoring reciprocal minute balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstProvided, firstReceived, secondProvided, secondReceived } =
    request;
  const compute = (): Output => {
    H.domain(
      firstProvided >= 0 &&
        firstReceived >= 0 &&
        secondProvided >= 0 &&
        secondReceived >= 0,
    );
    return {
      firstBalance: firstProvided - firstReceived,
      secondBalance: secondProvided - secondReceived,
      accountedGap:
        firstProvided + secondProvided - firstReceived - secondReceived,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstProvided: 60,
    firstReceived: 40,
    secondProvided: 40,
    secondReceived: 60,
  },
  output: { firstBalance: 20, secondBalance: -20, accountedGap: 0 },
} satisfies ToolExample<Input, Output>;
export const peerMentoringReciprocalMinuteBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "andragogy/peer-mentoring-reciprocal-minute-balance",
      title: "Peer Mentoring Reciprocal Minute Balance Tool",
      description:
        "Calculate peer mentoring reciprocal minute balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstProvided: { type: "number", minimum: 0 },
          firstReceived: { type: "number", minimum: 0 },
          secondProvided: { type: "number", minimum: 0 },
          secondReceived: { type: "number", minimum: 0 },
        },
        required: [
          "firstProvided",
          "firstReceived",
          "secondProvided",
          "secondReceived",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstBalance: { type: "number" },
          secondBalance: { type: "number" },
          accountedGap: { type: "number" },
        },
        required: ["firstBalance", "secondBalance", "accountedGap"],
      },
      ports: {
        inputs: [
          {
            id: "firstProvided",
            label: "First Provided",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstReceived",
            label: "First Received",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondProvided",
            label: "Second Provided",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondReceived",
            label: "Second Received",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "firstBalance",
            label: "First Balance",
            valueType: { type: "number" },
          },
          {
            id: "secondBalance",
            label: "Second Balance",
            valueType: { type: "number" },
          },
          {
            id: "accountedGap",
            label: "Accounted Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = peerMentoringReciprocalMinuteBalanceTool.execute;
export default peerMentoringReciprocalMinuteBalanceTool;

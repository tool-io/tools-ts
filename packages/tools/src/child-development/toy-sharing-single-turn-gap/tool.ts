import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousTurnEndSeconds: number;
  readonly nextTurnStartSeconds: number;
};
export type Output = {
  readonly signedGapSeconds: number;
  readonly overlapSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousTurnEndSeconds: { type: "number" },
    nextTurnStartSeconds: { type: "number" },
  },
  required: ["previousTurnEndSeconds", "nextTurnStartSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedGapSeconds: { type: "number" },
    overlapSeconds: { type: "number" },
  },
  required: ["signedGapSeconds", "overlapSeconds"],
} as const;
/** Describe a recorded toy-sharing turn transition without interpreting social behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousTurnEndSeconds, nextTurnStartSeconds } = request;
  const compute = (): Output => {
    return {
      signedGapSeconds: nextTurnStartSeconds - previousTurnEndSeconds,
      overlapSeconds: Math.max(
        0,
        previousTurnEndSeconds - nextTurnStartSeconds,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousTurnEndSeconds: 10, nextTurnStartSeconds: 12 },
  output: { signedGapSeconds: 2, overlapSeconds: 0 },
} satisfies ToolExample<Input, Output>;
export const toySharingSingleTurnGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["child-development", "child development", "psychology"],
      keywords: ["child development", "psychology"],
    },
    id: "child-development/toy-sharing-single-turn-gap",
    title: "Toy Sharing Single Turn Gap",
    description:
      "Describe a recorded toy-sharing turn transition without interpreting social behavior.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousTurnEndSeconds: { type: "number" },
        nextTurnStartSeconds: { type: "number" },
      },
      required: ["previousTurnEndSeconds", "nextTurnStartSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedGapSeconds: { type: "number" },
        overlapSeconds: { type: "number" },
      },
      required: ["signedGapSeconds", "overlapSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "previousTurnEndSeconds",
          label: "Previous Turn End Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextTurnStartSeconds",
          label: "Next Turn Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedGapSeconds",
          label: "Signed Gap Seconds",
          valueType: { type: "number" },
        },
        {
          id: "overlapSeconds",
          label: "Overlap Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = toySharingSingleTurnGapTool.execute;
export default toySharingSingleTurnGapTool;

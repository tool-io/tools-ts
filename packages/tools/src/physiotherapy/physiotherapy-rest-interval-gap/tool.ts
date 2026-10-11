import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousSetEndSeconds: number;
  readonly nextSetStartSeconds: number;
};
export type Output = {
  readonly signedRestSeconds: number;
  readonly overlap: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousSetEndSeconds: { type: "number" },
    nextSetStartSeconds: { type: "number" },
  },
  required: ["previousSetEndSeconds", "nextSetStartSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedRestSeconds: { type: "number" },
    overlap: { type: "boolean" },
  },
  required: ["signedRestSeconds", "overlap"],
} as const;
/** Compare explicit exercise-set endpoints without recommending a rest duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousSetEndSeconds, nextSetStartSeconds } = request;
  const compute = (): Output => {
    return {
      signedRestSeconds: nextSetStartSeconds - previousSetEndSeconds,
      overlap: nextSetStartSeconds < previousSetEndSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousSetEndSeconds: 100, nextSetStartSeconds: 145 },
  output: { signedRestSeconds: 45, overlap: false },
} satisfies ToolExample<Input, Output>;
export const physiotherapyRestIntervalGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["physiotherapy", "health and medicine"],
      keywords: ["physiotherapy", "health and medicine"],
    },
    id: "physiotherapy/physiotherapy-rest-interval-gap",
    title: "Physiotherapy Rest Interval Gap",
    description:
      "Compare explicit exercise-set endpoints without recommending a rest duration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousSetEndSeconds: { type: "number" },
        nextSetStartSeconds: { type: "number" },
      },
      required: ["previousSetEndSeconds", "nextSetStartSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedRestSeconds: { type: "number" },
        overlap: { type: "boolean" },
      },
      required: ["signedRestSeconds", "overlap"],
    },
    ports: {
      inputs: [
        {
          id: "previousSetEndSeconds",
          label: "Previous Set End Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextSetStartSeconds",
          label: "Next Set Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedRestSeconds",
          label: "Signed Rest Seconds",
          valueType: { type: "number" },
        },
        { id: "overlap", label: "Overlap", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = physiotherapyRestIntervalGapTool.execute;
export default physiotherapyRestIntervalGapTool;

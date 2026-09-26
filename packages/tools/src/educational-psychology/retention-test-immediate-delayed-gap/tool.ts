import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly immediate: number;
  readonly delayed: number;
  readonly maximum: number;
};
export type Output = {
  readonly loss: number;
  readonly retainedFraction: number;
  readonly delayedCeilingGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    immediate: { type: "number", exclusiveMinimum: 0 },
    delayed: { type: "number", minimum: 0 },
    maximum: { type: "number" },
  },
  required: ["immediate", "delayed", "maximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loss: { type: "number" },
    retainedFraction: { type: "number" },
    delayedCeilingGap: { type: "number" },
  },
  required: ["loss", "retainedFraction", "delayedCeilingGap"],
} as const;
/** Calculate retention test immediate delayed gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { immediate, delayed, maximum } = request;
  const compute = (): Output => {
    H.positive(immediate);
    H.domain(maximum >= immediate && delayed >= 0 && delayed <= maximum);
    return {
      loss: immediate - delayed,
      retainedFraction: delayed / immediate,
      delayedCeilingGap: maximum - delayed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { immediate: 80, delayed: 60, maximum: 100 },
  output: { loss: 20, retainedFraction: 0.75, delayedCeilingGap: 40 },
} satisfies ToolExample<Input, Output>;
export const retentionTestImmediateDelayedGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/retention-test-immediate-delayed-gap",
    title: "Retention Test Immediate Delayed Gap Tool",
    description:
      "Calculate retention test immediate delayed gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        immediate: { type: "number", exclusiveMinimum: 0 },
        delayed: { type: "number", minimum: 0 },
        maximum: { type: "number" },
      },
      required: ["immediate", "delayed", "maximum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loss: { type: "number" },
        retainedFraction: { type: "number" },
        delayedCeilingGap: { type: "number" },
      },
      required: ["loss", "retainedFraction", "delayedCeilingGap"],
    },
    ports: {
      inputs: [
        {
          id: "immediate",
          label: "Immediate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "delayed",
          label: "Delayed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximum",
          label: "Maximum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "loss", label: "Loss", valueType: { type: "number" } },
        {
          id: "retainedFraction",
          label: "Retained Fraction",
          valueType: { type: "number" },
        },
        {
          id: "delayedCeilingGap",
          label: "Delayed Ceiling Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = retentionTestImmediateDelayedGapTool.execute;
export default retentionTestImmediateDelayedGapTool;

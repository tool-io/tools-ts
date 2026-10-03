import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetDuration: number;
  readonly elapsedDuration: number;
  readonly creditedDuration: number;
};
export type Output = {
  readonly countedDuration: number;
  readonly remaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetDuration: { type: "number", minimum: 0 },
    elapsedDuration: { type: "number", minimum: 0 },
    creditedDuration: { type: "number", minimum: 0 },
  },
  required: ["targetDuration", "elapsedDuration", "creditedDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedDuration: { type: "number" },
    remaining: { type: "number" },
  },
  required: ["countedDuration", "remaining"],
} as const;
/** Calculate service target remaining time from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetDuration, elapsedDuration, creditedDuration } = request;
  const compute = (): Output => {
    H.domain(
      targetDuration >= 0 &&
        elapsedDuration >= 0 &&
        creditedDuration >= 0 &&
        creditedDuration <= elapsedDuration,
    );
    return {
      countedDuration: elapsedDuration - creditedDuration,
      remaining: targetDuration - elapsedDuration + creditedDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targetDuration: 30, elapsedDuration: 20, creditedDuration: 5 },
  output: { countedDuration: 15, remaining: 15 },
} satisfies ToolExample<Input, Output>;
export const serviceTargetRemainingTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/service-target-remaining-time",
    title: "Service Target Remaining Time Tool",
    description:
      "Calculate service target remaining time from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetDuration: { type: "number", minimum: 0 },
        elapsedDuration: { type: "number", minimum: 0 },
        creditedDuration: { type: "number", minimum: 0 },
      },
      required: ["targetDuration", "elapsedDuration", "creditedDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedDuration: { type: "number" },
        remaining: { type: "number" },
      },
      required: ["countedDuration", "remaining"],
    },
    ports: {
      inputs: [
        {
          id: "targetDuration",
          label: "Target Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedDuration",
          label: "Elapsed Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditedDuration",
          label: "Credited Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "countedDuration",
          label: "Counted Duration",
          valueType: { type: "number" },
        },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = serviceTargetRemainingTimeTool.execute;
export default serviceTargetRemainingTimeTool;

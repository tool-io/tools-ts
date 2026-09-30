import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly before: number; readonly after: number };
export type Output = {
  readonly minimumIncrement: number;
  readonly resetDetected: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    before: { type: "number", minimum: 0 },
    after: { type: "number", minimum: 0 },
  },
  required: ["before", "after"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumIncrement: { type: "number" },
    resetDetected: { type: "boolean" },
  },
  required: ["minimumIncrement", "resetDetected"],
} as const;
/** Infer a minimum increment with a zero-reset assumption when a nonnegative counter decreases; unseen resets cannot be reconstructed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { before, after } = request;
  const compute = (): Output => {
    H.domain(before >= 0 && after >= 0);
    return {
      minimumIncrement: after >= before ? after - before : after,
      resetDetected: after < before,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { before: 95, after: 4 },
  output: { minimumIncrement: 4, resetDetected: true },
} satisfies ToolExample<Input, Output>;
export const counterResetLowerBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/counter-reset-lower-bound",
    title: "Counter Reset Lower Bound Tool",
    description:
      "Infer a minimum increment with a zero-reset assumption when a nonnegative counter decreases; unseen resets cannot be reconstructed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        before: { type: "number", minimum: 0 },
        after: { type: "number", minimum: 0 },
      },
      required: ["before", "after"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumIncrement: { type: "number" },
        resetDetected: { type: "boolean" },
      },
      required: ["minimumIncrement", "resetDetected"],
    },
    ports: {
      inputs: [
        {
          id: "before",
          label: "Before",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "after",
          label: "After",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "minimumIncrement",
          label: "Minimum Increment",
          valueType: { type: "number" },
        },
        {
          id: "resetDetected",
          label: "Reset Detected",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = counterResetLowerBoundTool.execute;
export default counterResetLowerBoundTool;

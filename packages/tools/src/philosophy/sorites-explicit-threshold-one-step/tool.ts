import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly step: number;
  readonly threshold: number;
  readonly inclusive: boolean;
};
export type Output = {
  readonly before: boolean;
  readonly after: boolean;
  readonly crosses: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number" },
    step: { type: "number" },
    threshold: { type: "number" },
    inclusive: { type: "boolean" },
  },
  required: ["quantity", "step", "threshold", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    before: { type: "boolean" },
    after: { type: "boolean" },
    crosses: { type: "boolean" },
  },
  required: ["before", "after", "crosses"],
} as const;
/** Apply an explicit numerical boundary; this does not resolve vague predicates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantity, step, threshold, inclusive } = request;
  const compute = (): Output => {
    return {
      before: inclusive ? quantity >= threshold : quantity > threshold,
      after: inclusive
        ? quantity + step >= threshold
        : quantity + step > threshold,
      crosses:
        (inclusive ? quantity >= threshold : quantity > threshold) !==
        (inclusive
          ? quantity + step >= threshold
          : quantity + step > threshold),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantity: 9, step: 1, threshold: 10, inclusive: true },
  output: { before: false, after: true, crosses: true },
} satisfies ToolExample<Input, Output>;
export const soritesExplicitThresholdOneStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/sorites-explicit-threshold-one-step",
    title: "Sorites Explicit Threshold One Step Tool",
    description:
      "Apply an explicit numerical boundary; this does not resolve vague predicates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number" },
        step: { type: "number" },
        threshold: { type: "number" },
        inclusive: { type: "boolean" },
      },
      required: ["quantity", "step", "threshold", "inclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        before: { type: "boolean" },
        after: { type: "boolean" },
        crosses: { type: "boolean" },
      },
      required: ["before", "after", "crosses"],
    },
    ports: {
      inputs: [
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "before", label: "Before", valueType: { type: "boolean" } },
        { id: "after", label: "After", valueType: { type: "boolean" } },
        { id: "crosses", label: "Crosses", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = soritesExplicitThresholdOneStepTool.execute;
export default soritesExplicitThresholdOneStepTool;

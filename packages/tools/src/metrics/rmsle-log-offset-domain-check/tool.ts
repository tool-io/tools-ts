import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actual: number;
  readonly predicted: number;
  readonly offset: number;
};
export type Output = {
  readonly valid: boolean;
  readonly actualArgument: number;
  readonly predictedArgument: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actual: { type: "number" },
    predicted: { type: "number" },
    offset: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["actual", "predicted", "offset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "boolean" },
    actualArgument: { type: "number" },
    predictedArgument: { type: "number" },
  },
  required: ["valid", "actualArgument", "predictedArgument"],
} as const;
/** Calculate rmsle log offset domain check from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actual, predicted, offset } = request;
  const compute = (): Output => {
    H.positive(offset);
    const actualArgument = actual + offset,
      predictedArgument = predicted + offset;
    return {
      valid: actualArgument > 0 && predictedArgument > 0,
      actualArgument,
      predictedArgument,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actual: -1, predicted: 2, offset: 1 },
  output: { valid: false, actualArgument: 0, predictedArgument: 3 },
} satisfies ToolExample<Input, Output>;
export const rmsleLogOffsetDomainCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/rmsle-log-offset-domain-check",
    title: "Rmsle Log Offset Domain Check Tool",
    description:
      "Calculate rmsle log offset domain check from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actual: { type: "number" },
        predicted: { type: "number" },
        offset: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["actual", "predicted", "offset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valid: { type: "boolean" },
        actualArgument: { type: "number" },
        predictedArgument: { type: "number" },
      },
      required: ["valid", "actualArgument", "predictedArgument"],
    },
    ports: {
      inputs: [
        {
          id: "actual",
          label: "Actual",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predicted",
          label: "Predicted",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        {
          id: "actualArgument",
          label: "Actual Argument",
          valueType: { type: "number" },
        },
        {
          id: "predictedArgument",
          label: "Predicted Argument",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rmsleLogOffsetDomainCheckTool.execute;
export default rmsleLogOffsetDomainCheckTool;

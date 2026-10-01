import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly response: string;
  readonly testId: string;
  readonly edition: string;
};
export type Output = {
  readonly response: string;
  readonly testKey: string;
  readonly determinate: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    response: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "neither", "indeterminate"],
    },
    testId: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
  },
  required: ["response", "testId", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    response: { type: "string", maxLength: 8192 },
    testKey: { type: "string", maxLength: 8192 },
    determinate: { type: "boolean" },
  },
  required: ["response", "testKey", "determinate"],
} as const;
/** Retain an explicitly supplied test response without inferring dominance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { response, testId, edition } = request;
  const compute = (): Output => {
    H.domain(
      ["left", "right", "neither", "indeterminate"].includes(response),
      "response",
    );
    H.domain(testId.length > 0 && edition.length > 0);
    return {
      response,
      testKey: JSON.stringify([testId, edition]),
      determinate: response === "left" || response === "right",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { response: "left", testId: "test-A", edition: "v1" },
  output: { response: "left", testKey: '["test-A","v1"]', determinate: true },
} satisfies ToolExample<Input, Output>;
export const eyeDominanceSuppliedTestCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/eye-dominance-supplied-test-code",
    title: "Eye Dominance Supplied Test Code Tool",
    description:
      "Retain an explicitly supplied test response without inferring dominance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        response: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "neither", "indeterminate"],
        },
        testId: { type: "string", maxLength: 8192 },
        edition: { type: "string", maxLength: 8192 },
      },
      required: ["response", "testId", "edition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        response: { type: "string", maxLength: 8192 },
        testKey: { type: "string", maxLength: 8192 },
        determinate: { type: "boolean" },
      },
      required: ["response", "testKey", "determinate"],
    },
    ports: {
      inputs: [
        {
          id: "response",
          label: "Response",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "testId",
          label: "Test Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "response", label: "Response", valueType: { type: "string" } },
        { id: "testKey", label: "Test Key", valueType: { type: "string" } },
        {
          id: "determinate",
          label: "Determinate",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = eyeDominanceSuppliedTestCodeTool.execute;
export default eyeDominanceSuppliedTestCodeTool;

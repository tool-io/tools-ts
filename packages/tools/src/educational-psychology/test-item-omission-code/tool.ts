import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly presented: boolean;
  readonly answered: boolean;
  readonly deliberatelySkipped: boolean;
};
export type Output = { readonly code: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presented: { type: "boolean" },
    answered: { type: "boolean" },
    deliberatelySkipped: { type: "boolean" },
  },
  required: ["presented", "answered", "deliberatelySkipped"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { code: { type: "string", maxLength: 8192 } },
  required: ["code"],
} as const;
/** Keep explicitly recorded omitted, deliberately skipped and unpresented test items separate without scoring performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { presented, answered, deliberatelySkipped } = request;
  const compute = (): Output => {
    H.domain(!answered || presented, "answered");
    H.domain(!deliberatelySkipped || presented, "deliberatelySkipped");
    H.domain(!(answered && deliberatelySkipped), "answered");
    return {
      code: !presented
        ? "not-presented"
        : answered
          ? "answered"
          : deliberatelySkipped
            ? "skipped"
            : "omitted",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { presented: true, answered: false, deliberatelySkipped: true },
  output: { code: "skipped" },
} satisfies ToolExample<Input, Output>;
export const testItemOmissionCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "educational-psychology",
        "educational psychology",
        "psychology",
      ],
      keywords: ["educational psychology", "psychology"],
    },
    id: "educational-psychology/test-item-omission-code",
    title: "Test Item Omission Code",
    description:
      "Keep explicitly recorded omitted, deliberately skipped and unpresented test items separate without scoring performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presented: { type: "boolean" },
        answered: { type: "boolean" },
        deliberatelySkipped: { type: "boolean" },
      },
      required: ["presented", "answered", "deliberatelySkipped"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { code: { type: "string", maxLength: 8192 } },
      required: ["code"],
    },
    ports: {
      inputs: [
        {
          id: "presented",
          label: "Presented",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "answered",
          label: "Answered",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "deliberatelySkipped",
          label: "Deliberately Skipped",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "code", label: "Code", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = testItemOmissionCodeTool.execute;
export default testItemOmissionCodeTool;

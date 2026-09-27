import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalDeadline: number;
  readonly extension: number;
  readonly completion: number;
};
export type Output = { readonly newDeadline: number; readonly slack: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalDeadline: { type: "number" },
    extension: { type: "number", minimum: 0 },
    completion: { type: "number" },
  },
  required: ["originalDeadline", "extension", "completion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { newDeadline: { type: "number" }, slack: { type: "number" } },
  required: ["newDeadline", "slack"],
} as const;
/** Calculate obligation deadline extension slack from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalDeadline, extension, completion } = request;
  const compute = (): Output => {
    H.domain(extension >= 0);
    return {
      newDeadline: originalDeadline + extension,
      slack: originalDeadline + extension - completion,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalDeadline: 100, extension: 10, completion: 105 },
  output: { newDeadline: 110, slack: 5 },
} satisfies ToolExample<Input, Output>;
export const obligationDeadlineExtensionSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/obligation-deadline-extension-slack",
    title: "Obligation Deadline Extension Slack Tool",
    description:
      "Calculate obligation deadline extension slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalDeadline: { type: "number" },
        extension: { type: "number", minimum: 0 },
        completion: { type: "number" },
      },
      required: ["originalDeadline", "extension", "completion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newDeadline: { type: "number" },
        slack: { type: "number" },
      },
      required: ["newDeadline", "slack"],
    },
    ports: {
      inputs: [
        {
          id: "originalDeadline",
          label: "Original Deadline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extension",
          label: "Extension",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "completion",
          label: "Completion",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "newDeadline",
          label: "New Deadline",
          valueType: { type: "number" },
        },
        { id: "slack", label: "Slack", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = obligationDeadlineExtensionSlackTool.execute;
export default obligationDeadlineExtensionSlackTool;

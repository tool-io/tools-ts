import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedAt: number;
  readonly repliedAt: number;
  readonly suppliedWindow: number;
};
export type Output = { readonly elapsed: number; readonly slack: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedAt: { type: "number" },
    repliedAt: { type: "number" },
    suppliedWindow: { type: "number", minimum: 0 },
  },
  required: ["requestedAt", "repliedAt", "suppliedWindow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsed: { type: "number" }, slack: { type: "number" } },
  required: ["elapsed", "slack"],
} as const;
/** Calculate advisory reply window gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestedAt, repliedAt, suppliedWindow } = request;
  const compute = (): Output => {
    H.domain(suppliedWindow >= 0);
    return {
      elapsed: repliedAt - requestedAt,
      slack: suppliedWindow - repliedAt + requestedAt,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestedAt: 10, repliedAt: 25, suppliedWindow: 20 },
  output: { elapsed: 15, slack: 5 },
} satisfies ToolExample<Input, Output>;
export const advisoryReplyWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-extension/advisory-reply-window-gap",
    title: "Advisory Reply Window Gap Tool",
    description:
      "Calculate advisory reply window gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedAt: { type: "number" },
        repliedAt: { type: "number" },
        suppliedWindow: { type: "number", minimum: 0 },
      },
      required: ["requestedAt", "repliedAt", "suppliedWindow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { elapsed: { type: "number" }, slack: { type: "number" } },
      required: ["elapsed", "slack"],
    },
    ports: {
      inputs: [
        {
          id: "requestedAt",
          label: "Requested At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "repliedAt",
          label: "Replied At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWindow",
          label: "Supplied Window",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        { id: "slack", label: "Slack", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = advisoryReplyWindowGapTool.execute;
export default advisoryReplyWindowGapTool;

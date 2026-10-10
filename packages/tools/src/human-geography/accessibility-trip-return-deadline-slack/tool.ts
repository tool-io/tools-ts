import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly returnTime: number;
  readonly suppliedDeadline: number;
};
export type Output = { readonly slack: number; readonly onTime: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnTime: { type: "number" },
    suppliedDeadline: { type: "number" },
  },
  required: ["returnTime", "suppliedDeadline"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slack: { type: "number" }, onTime: { type: "boolean" } },
  required: ["slack", "onTime"],
} as const;
/** Compare supplied trip return and inclusive deadline timestamps without predicting travel or accessibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { returnTime, suppliedDeadline } = request;
  const compute = (): Output => {
    return {
      slack: suppliedDeadline - returnTime,
      onTime: returnTime <= suppliedDeadline,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { returnTime: 15, suppliedDeadline: 20 },
  output: { slack: 5, onTime: true },
} satisfies ToolExample<Input, Output>;
export const accessibilityTripReturnDeadlineSlackTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "human-geography/accessibility-trip-return-deadline-slack",
      title: "Accessibility Trip Return Deadline Slack Tool",
      description:
        "Compare supplied trip return and inclusive deadline timestamps without predicting travel or accessibility.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          returnTime: { type: "number" },
          suppliedDeadline: { type: "number" },
        },
        required: ["returnTime", "suppliedDeadline"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { slack: { type: "number" }, onTime: { type: "boolean" } },
        required: ["slack", "onTime"],
      },
      ports: {
        inputs: [
          {
            id: "returnTime",
            label: "Return Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedDeadline",
            label: "Supplied Deadline",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "slack", label: "Slack", valueType: { type: "number" } },
          { id: "onTime", label: "On Time", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = accessibilityTripReturnDeadlineSlackTool.execute;
export default accessibilityTripReturnDeadlineSlackTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lineLength: number;
  readonly straightDistance: number;
};
export type Output = { readonly slack: number; readonly slackFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineLength: { type: "number", exclusiveMinimum: 0 },
    straightDistance: { type: "number", minimum: 0 },
  },
  required: ["lineLength", "straightDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slack: { type: "number" }, slackFraction: { type: "number" } },
  required: ["slack", "slackFraction"],
} as const;
/** Calculate mooring line length slack ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lineLength, straightDistance } = request;
  const compute = (): Output => {
    H.positive(lineLength);
    H.domain(straightDistance >= 0 && straightDistance <= lineLength);
    const slack = lineLength - straightDistance;
    return { slack, slackFraction: slack / lineLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lineLength: 30, straightDistance: 24 },
  output: { slack: 6, slackFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const mooringLineLengthSlackRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/mooring-line-length-slack-ratio",
    title: "Mooring Line Length Slack Ratio Tool",
    description:
      "Calculate mooring line length slack ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineLength: { type: "number", exclusiveMinimum: 0 },
        straightDistance: { type: "number", minimum: 0 },
      },
      required: ["lineLength", "straightDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slack: { type: "number" },
        slackFraction: { type: "number" },
      },
      required: ["slack", "slackFraction"],
    },
    ports: {
      inputs: [
        {
          id: "lineLength",
          label: "Line Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "straightDistance",
          label: "Straight Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "slack", label: "Slack", valueType: { type: "number" } },
        {
          id: "slackFraction",
          label: "Slack Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mooringLineLengthSlackRatioTool.execute;
export default mooringLineLengthSlackRatioTool;

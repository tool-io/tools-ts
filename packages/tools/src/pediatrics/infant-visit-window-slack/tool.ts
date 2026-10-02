import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visitAt: number;
  readonly earliest: number;
  readonly latest: number;
};
export type Output = {
  readonly lowerSlack: number;
  readonly upperSlack: number;
  readonly inside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitAt: { type: "number" },
    earliest: { type: "number" },
    latest: { type: "number" },
  },
  required: ["visitAt", "earliest", "latest"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerSlack: { type: "number" },
    upperSlack: { type: "number" },
    inside: { type: "boolean" },
  },
  required: ["lowerSlack", "upperSlack", "inside"],
} as const;
/** Compare a research visit coordinate with caller-supplied inclusive scheduling bounds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visitAt, earliest, latest } = request;
  const compute = (): Output => {
    H.domain(latest >= earliest);
    return {
      lowerSlack: visitAt - earliest,
      upperSlack: latest - visitAt,
      inside: visitAt >= earliest && visitAt <= latest,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visitAt: 15, earliest: 10, latest: 20 },
  output: { lowerSlack: 5, upperSlack: 5, inside: true },
} satisfies ToolExample<Input, Output>;
export const infantVisitWindowSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pediatrics/infant-visit-window-slack",
    title: "Infant Visit Window Slack Tool",
    description:
      "Compare a research visit coordinate with caller-supplied inclusive scheduling bounds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visitAt: { type: "number" },
        earliest: { type: "number" },
        latest: { type: "number" },
      },
      required: ["visitAt", "earliest", "latest"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerSlack: { type: "number" },
        upperSlack: { type: "number" },
        inside: { type: "boolean" },
      },
      required: ["lowerSlack", "upperSlack", "inside"],
    },
    ports: {
      inputs: [
        {
          id: "visitAt",
          label: "Visit At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "earliest",
          label: "Earliest",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latest",
          label: "Latest",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lowerSlack",
          label: "Lower Slack",
          valueType: { type: "number" },
        },
        {
          id: "upperSlack",
          label: "Upper Slack",
          valueType: { type: "number" },
        },
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = infantVisitWindowSlackTool.execute;
export default infantVisitWindowSlackTool;

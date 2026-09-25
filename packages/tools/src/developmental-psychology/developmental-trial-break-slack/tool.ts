import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nextTrialAt: number;
  readonly priorTrialEnd: number;
  readonly suppliedBreak: number;
};
export type Output = { readonly available: number; readonly slack: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nextTrialAt: { type: "number" },
    priorTrialEnd: { type: "number" },
    suppliedBreak: { type: "number", minimum: 0 },
  },
  required: ["nextTrialAt", "priorTrialEnd", "suppliedBreak"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { available: { type: "number" }, slack: { type: "number" } },
  required: ["available", "slack"],
} as const;
/** Compare a research schedule with an explicit break allowance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nextTrialAt, priorTrialEnd, suppliedBreak } = request;
  const compute = (): Output => {
    H.domain(suppliedBreak >= 0);
    return {
      available: nextTrialAt - priorTrialEnd,
      slack: nextTrialAt - priorTrialEnd - suppliedBreak,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nextTrialAt: 30, priorTrialEnd: 20, suppliedBreak: 5 },
  output: { available: 10, slack: 5 },
} satisfies ToolExample<Input, Output>;
export const developmentalTrialBreakSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/developmental-trial-break-slack",
    title: "Developmental Trial Break Slack Tool",
    description:
      "Compare a research schedule with an explicit break allowance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nextTrialAt: { type: "number" },
        priorTrialEnd: { type: "number" },
        suppliedBreak: { type: "number", minimum: 0 },
      },
      required: ["nextTrialAt", "priorTrialEnd", "suppliedBreak"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { available: { type: "number" }, slack: { type: "number" } },
      required: ["available", "slack"],
    },
    ports: {
      inputs: [
        {
          id: "nextTrialAt",
          label: "Next Trial At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priorTrialEnd",
          label: "Prior Trial End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBreak",
          label: "Supplied Break",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "available", label: "Available", valueType: { type: "number" } },
        { id: "slack", label: "Slack", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = developmentalTrialBreakSlackTool.execute;
export default developmentalTrialBreakSlackTool;

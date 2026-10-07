import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly riskRestartTime: number;
  readonly nextEventTime: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    riskRestartTime: { type: "number" },
    nextEventTime: { type: "number" },
  },
  required: ["riskRestartTime", "nextEventTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate signed time from an explicitly supplied recurrent-event risk restart to the next event. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { riskRestartTime, nextEventTime } = request;
  const compute = (): Output => {
    return { signedGap: nextEventTime - riskRestartTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { riskRestartTime: 12, nextEventTime: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const recurrentEventAtRiskGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biostatistics", "research and quality management"],
      keywords: ["biostatistics", "research and quality management"],
    },
    id: "biostatistics/recurrent-event-at-risk-gap",
    title: "Recurrent Event At Risk Gap",
    description:
      "Calculate signed time from an explicitly supplied recurrent-event risk restart to the next event.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        riskRestartTime: { type: "number" },
        nextEventTime: { type: "number" },
      },
      required: ["riskRestartTime", "nextEventTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "riskRestartTime",
          label: "Risk Restart Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextEventTime",
          label: "Next Event Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = recurrentEventAtRiskGapTool.execute;
export default recurrentEventAtRiskGapTool;

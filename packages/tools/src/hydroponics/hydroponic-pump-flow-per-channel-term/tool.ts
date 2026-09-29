import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalFlow: number;
  readonly bypassFlow: number;
  readonly channels: number;
};
export type Output = { readonly perChannel: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalFlow: { type: "number" },
    bypassFlow: { type: "number", minimum: 0 },
    channels: { type: "integer", minimum: 1 },
  },
  required: ["totalFlow", "bypassFlow", "channels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { perChannel: { type: "number" } },
  required: ["perChannel"],
} as const;
/** Calculate hydroponic pump flow per channel term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalFlow, bypassFlow, channels } = request;
  const compute = (): Output => {
    H.integer(channels, 1);
    H.domain(totalFlow >= bypassFlow && bypassFlow >= 0);
    return { perChannel: (totalFlow - bypassFlow) / channels };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalFlow: 100, bypassFlow: 20, channels: 4 },
  output: { perChannel: 20 },
} satisfies ToolExample<Input, Output>;
export const hydroponicPumpFlowPerChannelTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/hydroponic-pump-flow-per-channel-term",
    title: "Hydroponic Pump Flow Per Channel Term Tool",
    description:
      "Calculate hydroponic pump flow per channel term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalFlow: { type: "number" },
        bypassFlow: { type: "number", minimum: 0 },
        channels: { type: "integer", minimum: 1 },
      },
      required: ["totalFlow", "bypassFlow", "channels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { perChannel: { type: "number" } },
      required: ["perChannel"],
    },
    ports: {
      inputs: [
        {
          id: "totalFlow",
          label: "Total Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bypassFlow",
          label: "Bypass Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "channels",
          label: "Channels",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "perChannel",
          label: "Per Channel",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hydroponicPumpFlowPerChannelTermTool.execute;
export default hydroponicPumpFlowPerChannelTermTool;

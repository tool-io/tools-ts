import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly eventAt: number; readonly responseAt: number };
export type Output = { readonly delay: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eventAt: { type: "number" }, responseAt: { type: "number" } },
  required: ["eventAt", "responseAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delay: { type: "number" } },
  required: ["delay"],
} as const;
/** Compare supplied simulation timestamps; no emergency treatment timing or clinical recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventAt, responseAt } = request;
  const compute = (): Output => {
    return { delay: responseAt - eventAt };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventAt: 10, responseAt: 15 },
  output: { delay: 5 },
} satisfies ToolExample<Input, Output>;
export const simulationEventResponseDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "emergency-medicine/simulation-event-response-delay",
    title: "Simulation Event Response Delay Tool",
    description:
      "Compare supplied simulation timestamps; no emergency treatment timing or clinical recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventAt: { type: "number" },
        responseAt: { type: "number" },
      },
      required: ["eventAt", "responseAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { delay: { type: "number" } },
      required: ["delay"],
    },
    ports: {
      inputs: [
        {
          id: "eventAt",
          label: "Event At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responseAt",
          label: "Response At",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "delay", label: "Delay", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = simulationEventResponseDelayTool.execute;
export default simulationEventResponseDelayTool;

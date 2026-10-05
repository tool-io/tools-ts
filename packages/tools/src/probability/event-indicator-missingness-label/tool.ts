import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly observed: boolean; readonly event: boolean };
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { observed: { type: "boolean" }, event: { type: "boolean" } },
  required: ["observed", "event"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Keep missing observation status separate from the binary event indicator; the event flag is ignored when unobserved. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, event } = request;
  const compute = (): Output => {
    return {
      status: !observed
        ? "missing"
        : event
          ? "observed-event"
          : "observed-nonevent",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: true, event: false },
  output: { status: "observed-nonevent" },
} satisfies ToolExample<Input, Output>;
export const eventIndicatorMissingnessLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/event-indicator-missingness-label",
    title: "Event Indicator Missingness Label Tool",
    description:
      "Keep missing observation status separate from the binary event indicator; the event flag is ignored when unobserved.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { observed: { type: "boolean" }, event: { type: "boolean" } },
      required: ["observed", "event"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { status: { type: "string", maxLength: 8192 } },
      required: ["status"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "event",
          label: "Event",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = eventIndicatorMissingnessLabelTool.execute;
export default eventIndicatorMissingnessLabelTool;

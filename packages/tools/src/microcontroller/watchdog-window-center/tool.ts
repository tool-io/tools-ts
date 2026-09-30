import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly earliest: number; readonly latest: number };
export type Output = { readonly center: number; readonly halfWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { earliest: { type: "number" }, latest: { type: "number" } },
  required: ["earliest", "latest"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { center: { type: "number" }, halfWidth: { type: "number" } },
  required: ["center", "halfWidth"],
} as const;
/** Calculate watchdog window center from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliest, latest } = request;
  const compute = (): Output => {
    H.domain(earliest <= latest);
    return {
      center: earliest + (latest - earliest) / 2,
      halfWidth: (latest - earliest) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliest: 10, latest: 30 },
  output: { center: 20, halfWidth: 10 },
} satisfies ToolExample<Input, Output>;
export const watchdogWindowCenterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/watchdog-window-center",
    title: "Watchdog Window Center Tool",
    description:
      "Calculate watchdog window center from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { earliest: { type: "number" }, latest: { type: "number" } },
      required: ["earliest", "latest"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { center: { type: "number" }, halfWidth: { type: "number" } },
      required: ["center", "halfWidth"],
    },
    ports: {
      inputs: [
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
        { id: "center", label: "Center", valueType: { type: "number" } },
        { id: "halfWidth", label: "Half Width", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = watchdogWindowCenterTool.execute;
export default watchdogWindowCenterTool;

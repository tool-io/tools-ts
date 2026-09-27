import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly seconds: number; readonly padHours: boolean };
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seconds: { type: "integer", minimum: 0 },
    padHours: { type: "boolean" },
  },
  required: ["seconds", "padHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate clock duration over 24 hour label from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seconds, padHours } = request;
  const compute = (): Output => {
    H.integer(seconds, 0);
    const h = Math.floor(seconds / 3600),
      m = Math.floor(seconds / 60) % 60,
      s = seconds % 60;
    return {
      text:
        (padHours ? String(h).padStart(2, "0") : String(h)) +
        ":" +
        String(m).padStart(2, "0") +
        ":" +
        String(s).padStart(2, "0"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { seconds: 90061, padHours: true },
  output: { text: "25:01:01" },
} satisfies ToolExample<Input, Output>;
export const clockDurationOver24HourLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/clock-duration-over-24-hour-label",
    title: "Clock Duration Over 24 Hour Label Tool",
    description:
      "Calculate clock duration over 24 hour label from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seconds: { type: "integer", minimum: 0 },
        padHours: { type: "boolean" },
      },
      required: ["seconds", "padHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "seconds",
          label: "Seconds",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "padHours",
          label: "Pad Hours",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = clockDurationOver24HourLabelTool.execute;
export default clockDurationOver24HourLabelTool;

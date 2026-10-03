import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly end: number;
  readonly closedDuration: number;
};
export type Output = { readonly openTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "number" },
    end: { type: "number" },
    closedDuration: { type: "number", minimum: 0 },
  },
  required: ["start", "end", "closedDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { openTime: { type: "number" } },
  required: ["openTime"],
} as const;
/** Calculate service window elapsed open time from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, end, closedDuration } = request;
  const compute = (): Output => {
    H.domain(
      end >= start && closedDuration >= 0 && closedDuration <= end - start,
    );
    return { openTime: end - start - closedDuration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 10, end: 30, closedDuration: 5 },
  output: { openTime: 15 },
} satisfies ToolExample<Input, Output>;
export const serviceWindowElapsedOpenTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/service-window-elapsed-open-time",
    title: "Service Window Elapsed Open Time Tool",
    description:
      "Calculate service window elapsed open time from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        start: { type: "number" },
        end: { type: "number" },
        closedDuration: { type: "number", minimum: 0 },
      },
      required: ["start", "end", "closedDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { openTime: { type: "number" } },
      required: ["openTime"],
    },
    ports: {
      inputs: [
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "end",
          label: "End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "closedDuration",
          label: "Closed Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "openTime", label: "Open Time", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = serviceWindowElapsedOpenTimeTool.execute;
export default serviceWindowElapsedOpenTimeTool;

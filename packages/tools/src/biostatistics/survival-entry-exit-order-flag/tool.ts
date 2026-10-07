import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly entryTime: number; readonly exitTime: number };
export type Output = { readonly ordered: boolean; readonly duration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { entryTime: { type: "number" }, exitTime: { type: "number" } },
  required: ["entryTime", "exitTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ordered: { type: "boolean" }, duration: { type: "number" } },
  required: ["ordered", "duration"],
} as const;
/** Report survival-record entry/exit ordering without discarding a negative duration or estimating survival. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryTime, exitTime } = request;
  const compute = (): Output => {
    return { ordered: exitTime >= entryTime, duration: exitTime - entryTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entryTime: 5, exitTime: 12 },
  output: { ordered: true, duration: 7 },
} satisfies ToolExample<Input, Output>;
export const survivalEntryExitOrderFlagTool = H.defineSchemaCalculation<
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
    id: "biostatistics/survival-entry-exit-order-flag",
    title: "Survival Entry Exit Order Flag",
    description:
      "Report survival-record entry/exit ordering without discarding a negative duration or estimating survival.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryTime: { type: "number" },
        exitTime: { type: "number" },
      },
      required: ["entryTime", "exitTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ordered: { type: "boolean" },
        duration: { type: "number" },
      },
      required: ["ordered", "duration"],
    },
    ports: {
      inputs: [
        {
          id: "entryTime",
          label: "Entry Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exitTime",
          label: "Exit Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ordered", label: "Ordered", valueType: { type: "boolean" } },
        { id: "duration", label: "Duration", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = survivalEntryExitOrderFlagTool.execute;
export default survivalEntryExitOrderFlagTool;

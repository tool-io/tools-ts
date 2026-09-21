import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventStart: number;
  readonly eventEnd: number;
  readonly periodStart: number;
  readonly periodEnd: number;
};
export type Output = { readonly overlap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventStart: { type: "number" },
    eventEnd: { type: "number" },
    periodStart: { type: "number" },
    periodEnd: { type: "number" },
  },
  required: ["eventStart", "eventEnd", "periodStart", "periodEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlap: { type: "number" } },
  required: ["overlap"],
} as const;
/** Calculate farm event period overlap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventStart, eventEnd, periodStart, periodEnd } = request;
  const compute = (): Output => {
    H.domain(eventEnd >= eventStart && periodEnd >= periodStart);
    return {
      overlap: Math.max(
        0,
        Math.min(eventEnd, periodEnd) - Math.max(eventStart, periodStart),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventStart: 10, eventEnd: 20, periodStart: 15, periodEnd: 25 },
  output: { overlap: 5 },
} satisfies ToolExample<Input, Output>;
export const farmEventPeriodOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/farm-event-period-overlap",
    title: "Farm Event Period Overlap Tool",
    description:
      "Calculate farm event period overlap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventStart: { type: "number" },
        eventEnd: { type: "number" },
        periodStart: { type: "number" },
        periodEnd: { type: "number" },
      },
      required: ["eventStart", "eventEnd", "periodStart", "periodEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overlap: { type: "number" } },
      required: ["overlap"],
    },
    ports: {
      inputs: [
        {
          id: "eventStart",
          label: "Event Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eventEnd",
          label: "Event End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodStart",
          label: "Period Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodEnd",
          label: "Period End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmEventPeriodOverlapTool.execute;
export default farmEventPeriodOverlapTool;

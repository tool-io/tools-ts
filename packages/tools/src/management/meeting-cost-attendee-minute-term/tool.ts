import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly attendeeHourlyRates: readonly number[];
  readonly durationMinutes: number;
  readonly fixedCost: number;
};
export type Output = { readonly laborCost: number; readonly totalCost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attendeeHourlyRates: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    durationMinutes: { type: "number", minimum: 0 },
    fixedCost: { type: "number", minimum: 0 },
  },
  required: ["attendeeHourlyRates", "durationMinutes", "fixedCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { laborCost: { type: "number" }, totalCost: { type: "number" } },
  required: ["laborCost", "totalCost"],
} as const;
/** Calculate meeting cost attendee minute term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attendeeHourlyRates, durationMinutes, fixedCost } = request;
  const compute = (): Output => {
    H.domain(
      attendeeHourlyRates.every((x) => x >= 0) &&
        durationMinutes >= 0 &&
        fixedCost >= 0,
    );
    return {
      laborCost:
        (attendeeHourlyRates.reduce((a, b) => a + b, 0) * durationMinutes) / 60,
      totalCost:
        (attendeeHourlyRates.reduce((a, b) => a + b, 0) * durationMinutes) /
          60 +
        fixedCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { attendeeHourlyRates: [30, 60], durationMinutes: 40, fixedCost: 10 },
  output: { laborCost: 60, totalCost: 70 },
} satisfies ToolExample<Input, Output>;
export const meetingCostAttendeeMinuteTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/meeting-cost-attendee-minute-term",
    title: "Meeting Cost Attendee Minute Term Tool",
    description:
      "Calculate meeting cost attendee minute term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attendeeHourlyRates: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        durationMinutes: { type: "number", minimum: 0 },
        fixedCost: { type: "number", minimum: 0 },
      },
      required: ["attendeeHourlyRates", "durationMinutes", "fixedCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        laborCost: { type: "number" },
        totalCost: { type: "number" },
      },
      required: ["laborCost", "totalCost"],
    },
    ports: {
      inputs: [
        {
          id: "attendeeHourlyRates",
          label: "Attendee Hourly Rates",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "durationMinutes",
          label: "Duration Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedCost",
          label: "Fixed Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "laborCost", label: "Labor Cost", valueType: { type: "number" } },
        { id: "totalCost", label: "Total Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = meetingCostAttendeeMinuteTermTool.execute;
export default meetingCostAttendeeMinuteTermTool;

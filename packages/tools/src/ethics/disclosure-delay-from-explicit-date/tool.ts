import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventDay: number;
  readonly disclosureDay: number;
  readonly suppliedPauseDays: number;
};
export type Output = {
  readonly calendarDelay: number;
  readonly countedDelay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventDay: { type: "integer" },
    disclosureDay: { type: "integer" },
    suppliedPauseDays: { type: "integer", minimum: 0 },
  },
  required: ["eventDay", "disclosureDay", "suppliedPauseDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calendarDelay: { type: "integer" },
    countedDelay: { type: "integer" },
  },
  required: ["calendarDelay", "countedDelay"],
} as const;
/** Signed supplied disclosure timing with an explicit accounting pause, without determining a disclosure duty. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventDay, disclosureDay, suppliedPauseDays } = request;
  const compute = (): Output => {
    H.integer(suppliedPauseDays, 0);
    return {
      calendarDelay: disclosureDay - eventDay,
      countedDelay: disclosureDay - eventDay - suppliedPauseDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventDay: 100, disclosureDay: 120, suppliedPauseDays: 5 },
  output: { calendarDelay: 20, countedDelay: 15 },
} satisfies ToolExample<Input, Output>;
export const disclosureDelayFromExplicitDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/disclosure-delay-from-explicit-date",
    title: "Disclosure Delay From Explicit Date Tool",
    description:
      "Signed supplied disclosure timing with an explicit accounting pause, without determining a disclosure duty.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventDay: { type: "integer" },
        disclosureDay: { type: "integer" },
        suppliedPauseDays: { type: "integer", minimum: 0 },
      },
      required: ["eventDay", "disclosureDay", "suppliedPauseDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calendarDelay: { type: "integer" },
        countedDelay: { type: "integer" },
      },
      required: ["calendarDelay", "countedDelay"],
    },
    ports: {
      inputs: [
        {
          id: "eventDay",
          label: "Event Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "disclosureDay",
          label: "Disclosure Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedPauseDays",
          label: "Supplied Pause Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "calendarDelay",
          label: "Calendar Delay",
          valueType: { type: "integer" },
        },
        {
          id: "countedDelay",
          label: "Counted Delay",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = disclosureDelayFromExplicitDateTool.execute;
export default disclosureDelayFromExplicitDateTool;

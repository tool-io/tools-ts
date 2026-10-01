import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventHour: number;
  readonly suppliedBirthHour: number;
  readonly suppliedClockOffset: number;
};
export type Output = { readonly elapsedHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventHour: { type: "number" },
    suppliedBirthHour: { type: "number" },
    suppliedClockOffset: { type: "number" },
  },
  required: ["eventHour", "suppliedBirthHour", "suppliedClockOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsedHours: { type: "number" } },
  required: ["elapsedHours"],
} as const;
/** Compare supplied absolute research timestamps to an explicit birth-time anchor without care guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventHour, suppliedBirthHour, suppliedClockOffset } = request;
  const compute = (): Output => {
    return {
      elapsedHours: eventHour - suppliedClockOffset - suppliedBirthHour,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventHour: 30, suppliedBirthHour: 10, suppliedClockOffset: 2 },
  output: { elapsedHours: 18 },
} satisfies ToolExample<Input, Output>;
export const researchPostnatalHourOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neonatology/research-postnatal-hour-offset",
    title: "Research Postnatal Hour Offset Tool",
    description:
      "Compare supplied absolute research timestamps to an explicit birth-time anchor without care guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventHour: { type: "number" },
        suppliedBirthHour: { type: "number" },
        suppliedClockOffset: { type: "number" },
      },
      required: ["eventHour", "suppliedBirthHour", "suppliedClockOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { elapsedHours: { type: "number" } },
      required: ["elapsedHours"],
    },
    ports: {
      inputs: [
        {
          id: "eventHour",
          label: "Event Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBirthHour",
          label: "Supplied Birth Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedClockOffset",
          label: "Supplied Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "elapsedHours",
          label: "Elapsed Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchPostnatalHourOffsetTool.execute;
export default researchPostnatalHourOffsetTool;

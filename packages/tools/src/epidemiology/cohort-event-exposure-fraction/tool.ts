import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly events: number;
  readonly exposedPersons: number;
};
export type Output = { readonly fraction: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    events: { type: "integer", minimum: 0 },
    exposedPersons: { type: "integer", minimum: 0 },
  },
  required: ["events", "exposedPersons"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, defined: { type: "boolean" } },
  required: ["fraction", "defined"],
} as const;
/** Divide explicitly counted distinct persons with an event by exposed persons; not a recurrent-event incidence rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { events, exposedPersons } = request;
  const compute = (): Output => {
    H.integer(exposedPersons, 0);
    H.integer(events, 0, exposedPersons);
    return {
      fraction: exposedPersons > 0 ? events / exposedPersons : 0,
      defined: exposedPersons > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { events: 12, exposedPersons: 100 },
  output: { fraction: 0.12, defined: true },
} satisfies ToolExample<Input, Output>;
export const cohortEventExposureFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/cohort-event-exposure-fraction",
    title: "Cohort Event Exposure Fraction Tool",
    description:
      "Divide explicitly counted distinct persons with an event by exposed persons; not a recurrent-event incidence rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        events: { type: "integer", minimum: 0 },
        exposedPersons: { type: "integer", minimum: 0 },
      },
      required: ["events", "exposedPersons"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["fraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "events",
          label: "Events",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exposedPersons",
          label: "Exposed Persons",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = cohortEventExposureFractionTool.execute;
export default cohortEventExposureFractionTool;

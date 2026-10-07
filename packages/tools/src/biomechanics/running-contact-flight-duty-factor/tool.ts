import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactSeconds: number;
  readonly flightSeconds: number;
};
export type Output = {
  readonly cycleSeconds: number;
  readonly contactDutyFactor: number;
  readonly flightFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactSeconds: { type: "number", minimum: 0 },
    flightSeconds: { type: "number", minimum: 0 },
  },
  required: ["contactSeconds", "flightSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleSeconds: { type: "number" },
    contactDutyFactor: { type: "number" },
    flightFraction: { type: "number" },
  },
  required: ["cycleSeconds", "contactDutyFactor", "flightFraction"],
} as const;
/** Describe one explicitly paired running contact/flight cycle under a stated two-phase segmentation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactSeconds, flightSeconds } = request;
  const compute = (): Output => {
    H.domain(
      contactSeconds >= 0 &&
        flightSeconds >= 0 &&
        contactSeconds + flightSeconds > 0,
      "contactSeconds",
    );
    return {
      cycleSeconds: contactSeconds + flightSeconds,
      contactDutyFactor: contactSeconds / (contactSeconds + flightSeconds),
      flightFraction: flightSeconds / (contactSeconds + flightSeconds),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contactSeconds: 0.2, flightSeconds: 0.3 },
  output: { cycleSeconds: 0.5, contactDutyFactor: 0.4, flightFraction: 0.6 },
} satisfies ToolExample<Input, Output>;
export const runningContactFlightDutyFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biomechanics", "engineering"],
      keywords: ["biomechanics", "engineering"],
    },
    id: "biomechanics/running-contact-flight-duty-factor",
    title: "Running Contact Flight Duty Factor",
    description:
      "Describe one explicitly paired running contact/flight cycle under a stated two-phase segmentation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactSeconds: { type: "number", minimum: 0 },
        flightSeconds: { type: "number", minimum: 0 },
      },
      required: ["contactSeconds", "flightSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleSeconds: { type: "number" },
        contactDutyFactor: { type: "number" },
        flightFraction: { type: "number" },
      },
      required: ["cycleSeconds", "contactDutyFactor", "flightFraction"],
    },
    ports: {
      inputs: [
        {
          id: "contactSeconds",
          label: "Contact Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "flightSeconds",
          label: "Flight Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "cycleSeconds",
          label: "Cycle Seconds",
          valueType: { type: "number" },
        },
        {
          id: "contactDutyFactor",
          label: "Contact Duty Factor",
          valueType: { type: "number" },
        },
        {
          id: "flightFraction",
          label: "Flight Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = runningContactFlightDutyFactorTool.execute;
export default runningContactFlightDutyFactorTool;

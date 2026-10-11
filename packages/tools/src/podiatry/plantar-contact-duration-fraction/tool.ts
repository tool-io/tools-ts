import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactSeconds: number;
  readonly observationSeconds: number;
};
export type Output = {
  readonly contactFraction: number;
  readonly noncontactSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactSeconds: { type: "number", minimum: 0 },
    observationSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["contactSeconds", "observationSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactFraction: { type: "number" },
    noncontactSeconds: { type: "number" },
  },
  required: ["contactFraction", "noncontactSeconds"],
} as const;
/** Normalize explicitly marked plantar contact time to a supplied observation interval without assessing gait. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactSeconds, observationSeconds } = request;
  const compute = (): Output => {
    (H.domain(observationSeconds > 0, "observationSeconds"),
      observationSeconds);
    H.domain(
      contactSeconds >= 0 && contactSeconds <= observationSeconds,
      "contactSeconds",
    );
    return {
      contactFraction: contactSeconds / observationSeconds,
      noncontactSeconds: observationSeconds - contactSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contactSeconds: 0.6, observationSeconds: 1 },
  output: { contactFraction: 0.6, noncontactSeconds: 0.4 },
} satisfies ToolExample<Input, Output>;
export const plantarContactDurationFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["podiatry", "health and medicine"],
      keywords: ["podiatry", "health and medicine"],
    },
    id: "podiatry/plantar-contact-duration-fraction",
    title: "Plantar Contact Duration Fraction",
    description:
      "Normalize explicitly marked plantar contact time to a supplied observation interval without assessing gait.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactSeconds: { type: "number", minimum: 0 },
        observationSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["contactSeconds", "observationSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactFraction: { type: "number" },
        noncontactSeconds: { type: "number" },
      },
      required: ["contactFraction", "noncontactSeconds"],
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
          id: "observationSeconds",
          label: "Observation Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contactFraction",
          label: "Contact Fraction",
          valueType: { type: "number" },
        },
        {
          id: "noncontactSeconds",
          label: "Noncontact Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = plantarContactDurationFractionTool.execute;
export default plantarContactDurationFractionTool;

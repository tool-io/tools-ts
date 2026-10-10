import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactStartSeconds: number;
  readonly contactEndSeconds: number;
  readonly noncontactSeconds: number;
};
export type Output = { readonly contactSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactStartSeconds: { type: "number" },
    contactEndSeconds: { type: "number" },
    noncontactSeconds: { type: "number", minimum: 0 },
  },
  required: ["contactStartSeconds", "contactEndSeconds", "noncontactSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contactSeconds: { type: "number" } },
  required: ["contactSeconds"],
} as const;
/** Subtract explicit noncontact time from a recorded tool interval without computing vibration exposure or selecting a limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactStartSeconds, contactEndSeconds, noncontactSeconds } = request;
  const compute = (): Output => {
    H.domain(
      contactEndSeconds >= contactStartSeconds &&
        noncontactSeconds >= 0 &&
        noncontactSeconds <= contactEndSeconds - contactStartSeconds,
      "contactEndSeconds",
    );
    return {
      contactSeconds:
        contactEndSeconds - contactStartSeconds - noncontactSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    contactStartSeconds: 100,
    contactEndSeconds: 400,
    noncontactSeconds: 60,
  },
  output: { contactSeconds: 240 },
} satisfies ToolExample<Input, Output>;
export const vibrationToolContactDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "occupational-health",
        "occupational health",
        "health and medicine",
      ],
      keywords: ["occupational health", "health and medicine"],
    },
    id: "occupational-health/vibration-tool-contact-duration",
    title: "Vibration Tool Contact Duration",
    description:
      "Subtract explicit noncontact time from a recorded tool interval without computing vibration exposure or selecting a limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactStartSeconds: { type: "number" },
        contactEndSeconds: { type: "number" },
        noncontactSeconds: { type: "number", minimum: 0 },
      },
      required: [
        "contactStartSeconds",
        "contactEndSeconds",
        "noncontactSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contactSeconds: { type: "number" } },
      required: ["contactSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "contactStartSeconds",
          label: "Contact Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contactEndSeconds",
          label: "Contact End Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "noncontactSeconds",
          label: "Noncontact Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contactSeconds",
          label: "Contact Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = vibrationToolContactDurationTool.execute;
export default vibrationToolContactDurationTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly ageHours: number };
export type Output = {
  readonly completedDays: number;
  readonly remainingHours: number;
  readonly label: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ageHours: { type: "number", minimum: 0 } },
  required: ["ageHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completedDays: { type: "integer" },
    remainingHours: { type: "number" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["completedDays", "remainingHours", "label"],
} as const;
/** Express explicit elapsed neonatal age hours as completed days plus remaining hours without estimating gestational age. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ageHours } = request;
  const compute = (): Output => {
    H.domain(ageHours >= 0, "ageHours");
    return (() => {
      const completedDays = Math.floor(ageHours / 24),
        remainingHours = ageHours - completedDays * 24;
      return {
        completedDays,
        remainingHours,
        label: completedDays + " days " + remainingHours + " hours",
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ageHours: 54 },
  output: { completedDays: 2, remainingHours: 6, label: "2 days 6 hours" },
} satisfies ToolExample<Input, Output>;
export const neonatalAgeHoursDaysLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neonatology", "health and medicine"],
      keywords: ["neonatology", "health and medicine"],
    },
    id: "neonatology/neonatal-age-hours-days-label",
    title: "Neonatal Age Hours Days Label",
    description:
      "Express explicit elapsed neonatal age hours as completed days plus remaining hours without estimating gestational age.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ageHours: { type: "number", minimum: 0 } },
      required: ["ageHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completedDays: { type: "integer" },
        remainingHours: { type: "number" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["completedDays", "remainingHours", "label"],
    },
    ports: {
      inputs: [
        {
          id: "ageHours",
          label: "Age Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "completedDays",
          label: "Completed Days",
          valueType: { type: "integer" },
        },
        {
          id: "remainingHours",
          label: "Remaining Hours",
          valueType: { type: "number" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = neonatalAgeHoursDaysLabelTool.execute;
export default neonatalAgeHoursDaysLabelTool;

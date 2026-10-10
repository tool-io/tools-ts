import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly ageDays: number };
export type Output = {
  readonly completedWeeks: number;
  readonly remainingDays: number;
  readonly label: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ageDays: { type: "integer", minimum: 0 } },
  required: ["ageDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completedWeeks: { type: "integer" },
    remainingDays: { type: "integer" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["completedWeeks", "remainingDays", "label"],
} as const;
/** Express an explicitly supplied postnatal day count as completed weeks plus days without estimating gestational or corrected age. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ageDays } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(ageDays) &&
        ageDays >= 0 &&
        ageDays <= Number.MAX_SAFE_INTEGER,
      "ageDays",
    ),
      ageDays);
    return (() => {
      const completedWeeks = Math.floor(ageDays / 7),
        remainingDays = ageDays % 7;
      return {
        completedWeeks,
        remainingDays,
        label: completedWeeks + " weeks " + remainingDays + " days",
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ageDays: 17 },
  output: { completedWeeks: 2, remainingDays: 3, label: "2 weeks 3 days" },
} satisfies ToolExample<Input, Output>;
export const pediatricAgeCompletedWeekLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pediatrics", "health and medicine"],
      keywords: ["pediatrics", "health and medicine"],
    },
    id: "pediatrics/pediatric-age-completed-week-label",
    title: "Pediatric Age Completed Week Label",
    description:
      "Express an explicitly supplied postnatal day count as completed weeks plus days without estimating gestational or corrected age.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ageDays: { type: "integer", minimum: 0 } },
      required: ["ageDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completedWeeks: { type: "integer" },
        remainingDays: { type: "integer" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["completedWeeks", "remainingDays", "label"],
    },
    ports: {
      inputs: [
        {
          id: "ageDays",
          label: "Age Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "completedWeeks",
          label: "Completed Weeks",
          valueType: { type: "integer" },
        },
        {
          id: "remainingDays",
          label: "Remaining Days",
          valueType: { type: "integer" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = pediatricAgeCompletedWeekLabelTool.execute;
export default pediatricAgeCompletedWeekLabelTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedHours: number;
  readonly creditedFraction: number;
};
export type Output = { readonly creditedHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedHours: { type: "number", minimum: 0 },
    creditedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["reportedHours", "creditedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { creditedHours: { type: "number" } },
  required: ["creditedHours"],
} as const;
/** Apply an explicit credit fraction to recorded training hours without certifying competence or accreditation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedHours, creditedFraction } = request;
  const compute = (): Output => {
    H.domain(reportedHours >= 0, "reportedHours");
    (H.domain(
      creditedFraction >= 0 && creditedFraction <= 1,
      "creditedFraction",
    ),
      creditedFraction);
    return { creditedHours: reportedHours * creditedFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedHours: 40, creditedFraction: 0.75 },
  output: { creditedHours: 30 },
} satisfies ToolExample<Input, Output>;
export const acupunctureTrainingHourCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["acupuncture", "health and medicine"],
      keywords: ["acupuncture", "health and medicine"],
    },
    id: "acupuncture/acupuncture-training-hour-credit",
    title: "Acupuncture Training Hour Credit",
    description:
      "Apply an explicit credit fraction to recorded training hours without certifying competence or accreditation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedHours: { type: "number", minimum: 0 },
        creditedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["reportedHours", "creditedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { creditedHours: { type: "number" } },
      required: ["creditedHours"],
    },
    ports: {
      inputs: [
        {
          id: "reportedHours",
          label: "Reported Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditedFraction",
          label: "Credited Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "creditedHours",
          label: "Credited Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = acupunctureTrainingHourCreditTool.execute;
export default acupunctureTrainingHourCreditTool;

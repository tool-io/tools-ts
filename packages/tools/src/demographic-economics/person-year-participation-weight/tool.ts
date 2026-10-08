import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedDays: number;
  readonly yearDays: number;
  readonly participationFraction: number;
};
export type Output = { readonly weightedPersonYears: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedDays: { type: "number", minimum: 0 },
    yearDays: { type: "number", exclusiveMinimum: 0 },
    participationFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["observedDays", "yearDays", "participationFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedPersonYears: { type: "number" } },
  required: ["weightedPersonYears"],
} as const;
/** Normalize observed duration to explicitly defined person-years and an explicit participation fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedDays, yearDays, participationFraction } = request;
  const compute = (): Output => {
    H.domain(observedDays >= 0, "observedDays");
    (H.domain(yearDays > 0, "yearDays"), yearDays);
    (H.domain(
      participationFraction >= 0 && participationFraction <= 1,
      "participationFraction",
    ),
      participationFraction);
    return {
      weightedPersonYears: (observedDays / yearDays) * participationFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedDays: 180, yearDays: 360, participationFraction: 0.5 },
  output: { weightedPersonYears: 0.25 },
} satisfies ToolExample<Input, Output>;
export const personYearParticipationWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["demographic-economics", "demographic economics", "economics"],
      keywords: ["demographic economics", "economics"],
    },
    id: "demographic-economics/person-year-participation-weight",
    title: "Person Year Participation Weight",
    description:
      "Normalize observed duration to explicitly defined person-years and an explicit participation fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedDays: { type: "number", minimum: 0 },
        yearDays: { type: "number", exclusiveMinimum: 0 },
        participationFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["observedDays", "yearDays", "participationFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weightedPersonYears: { type: "number" } },
      required: ["weightedPersonYears"],
    },
    ports: {
      inputs: [
        {
          id: "observedDays",
          label: "Observed Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "yearDays",
          label: "Year Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "participationFraction",
          label: "Participation Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedPersonYears",
          label: "Weighted Person Years",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = personYearParticipationWeightTool.execute;
export default personYearParticipationWeightTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly members: number;
  readonly vacancies: number;
  readonly present: number;
  readonly requiredFraction: number;
  readonly excludeVacancies: boolean;
};
export type Output = {
  readonly base: number;
  readonly required: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    members: { type: "integer", minimum: 1 },
    vacancies: { type: "integer", minimum: 0 },
    present: { type: "integer", minimum: 0 },
    requiredFraction: { type: "number", minimum: 0, maximum: 1 },
    excludeVacancies: { type: "boolean" },
  },
  required: [
    "members",
    "vacancies",
    "present",
    "requiredFraction",
    "excludeVacancies",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    base: { type: "integer" },
    required: { type: "integer" },
    margin: { type: "integer" },
  },
  required: ["base", "required", "margin"],
} as const;
/** Apply a supplied fractional quorum rounded upward, with an explicit vacancy-denominator convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { members, vacancies, present, requiredFraction, excludeVacancies } =
    request;
  const compute = (): Output => {
    H.integer(members, 1);
    H.integer(vacancies, 0, members);
    H.integer(present, 0, members - vacancies);
    H.probability(requiredFraction);
    return {
      base: members - (excludeVacancies ? vacancies : 0),
      required: Math.ceil(
        (members - (excludeVacancies ? vacancies : 0)) * requiredFraction,
      ),
      margin:
        present -
        Math.ceil(
          (members - (excludeVacancies ? vacancies : 0)) * requiredFraction,
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    members: 100,
    vacancies: 10,
    present: 46,
    requiredFraction: 0.5,
    excludeVacancies: true,
  },
  output: { base: 90, required: 45, margin: 1 },
} satisfies ToolExample<Input, Output>;
export const legislativeAbsenceQuorumDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "political-science/legislative-absence-quorum-denominator",
      title: "Legislative Absence Quorum Denominator Tool",
      description:
        "Apply a supplied fractional quorum rounded upward, with an explicit vacancy-denominator convention.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          members: { type: "integer", minimum: 1 },
          vacancies: { type: "integer", minimum: 0 },
          present: { type: "integer", minimum: 0 },
          requiredFraction: { type: "number", minimum: 0, maximum: 1 },
          excludeVacancies: { type: "boolean" },
        },
        required: [
          "members",
          "vacancies",
          "present",
          "requiredFraction",
          "excludeVacancies",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          base: { type: "integer" },
          required: { type: "integer" },
          margin: { type: "integer" },
        },
        required: ["base", "required", "margin"],
      },
      ports: {
        inputs: [
          {
            id: "members",
            label: "Members",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "vacancies",
            label: "Vacancies",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "present",
            label: "Present",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "requiredFraction",
            label: "Required Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "excludeVacancies",
            label: "Exclude Vacancies",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "base", label: "Base", valueType: { type: "integer" } },
          { id: "required", label: "Required", valueType: { type: "integer" } },
          { id: "margin", label: "Margin", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = legislativeAbsenceQuorumDenominatorTool.execute;
export default legislativeAbsenceQuorumDenominatorTool;

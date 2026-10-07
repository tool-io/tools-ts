import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly authorizedSeats: number;
  readonly vacantSeats: number;
  readonly excludeVacancies: boolean;
  readonly presentMembers: number;
};
export type Output = {
  readonly denominator: number;
  readonly attendanceFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authorizedSeats: { type: "integer", minimum: 1 },
    vacantSeats: { type: "integer", minimum: 0 },
    excludeVacancies: { type: "boolean" },
    presentMembers: { type: "integer", minimum: 0 },
  },
  required: [
    "authorizedSeats",
    "vacantSeats",
    "excludeVacancies",
    "presentMembers",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    attendanceFraction: { type: "number" },
  },
  required: ["denominator", "attendanceFraction"],
} as const;
/** Calculate an explicit board attendance denominator with a supplied vacancy-exclusion policy without selecting quorum rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { authorizedSeats, vacantSeats, excludeVacancies, presentMembers } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(authorizedSeats) &&
        authorizedSeats >= 1 &&
        authorizedSeats <= Number.MAX_SAFE_INTEGER,
      "authorizedSeats",
    ),
      authorizedSeats);
    (H.domain(
      Number.isSafeInteger(vacantSeats) &&
        vacantSeats >= 0 &&
        vacantSeats <= authorizedSeats,
      "vacantSeats",
    ),
      vacantSeats);
    (H.domain(
      Number.isSafeInteger(presentMembers) &&
        presentMembers >= 0 &&
        presentMembers <= authorizedSeats - vacantSeats,
      "presentMembers",
    ),
      presentMembers);
    return (() => {
      const denominator =
        authorizedSeats - (excludeVacancies ? vacantSeats : 0);
      H.domain(denominator > 0, "authorizedSeats");
      return { denominator, attendanceFraction: presentMembers / denominator };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    authorizedSeats: 12,
    vacantSeats: 2,
    excludeVacancies: true,
    presentMembers: 6,
  },
  output: { denominator: 10, attendanceFraction: 0.6 },
} satisfies ToolExample<Input, Output>;
export const boardQuorumVacancyDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-administration",
        "business administration",
        "business and finance",
      ],
      keywords: ["business administration", "business and finance"],
    },
    id: "business-administration/board-quorum-vacancy-denominator",
    title: "Board Quorum Vacancy Denominator",
    description:
      "Calculate an explicit board attendance denominator with a supplied vacancy-exclusion policy without selecting quorum rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        authorizedSeats: { type: "integer", minimum: 1 },
        vacantSeats: { type: "integer", minimum: 0 },
        excludeVacancies: { type: "boolean" },
        presentMembers: { type: "integer", minimum: 0 },
      },
      required: [
        "authorizedSeats",
        "vacantSeats",
        "excludeVacancies",
        "presentMembers",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        attendanceFraction: { type: "number" },
      },
      required: ["denominator", "attendanceFraction"],
    },
    ports: {
      inputs: [
        {
          id: "authorizedSeats",
          label: "Authorized Seats",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "vacantSeats",
          label: "Vacant Seats",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludeVacancies",
          label: "Exclude Vacancies",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "presentMembers",
          label: "Present Members",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "attendanceFraction",
          label: "Attendance Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = boardQuorumVacancyDenominatorTool.execute;
export default boardQuorumVacancyDenominatorTool;

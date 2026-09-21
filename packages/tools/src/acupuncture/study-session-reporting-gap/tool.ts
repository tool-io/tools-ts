import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionDay: number;
  readonly reportedDay: number;
  readonly suppliedAllowedLag: number;
};
export type Output = {
  readonly lagDays: number;
  readonly beyondAllowance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionDay: { type: "integer" },
    reportedDay: { type: "integer" },
    suppliedAllowedLag: { type: "integer", minimum: 0 },
  },
  required: ["sessionDay", "reportedDay", "suppliedAllowedLag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lagDays: { type: "integer" },
    beyondAllowance: { type: "integer" },
  },
  required: ["lagDays", "beyondAllowance"],
} as const;
/** Audit supplied research reporting timestamps without recommending session schedules or treatment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessionDay, reportedDay, suppliedAllowedLag } = request;
  const compute = (): Output => {
    H.integer(suppliedAllowedLag, 0);
    return {
      lagDays: reportedDay - sessionDay,
      beyondAllowance: reportedDay - sessionDay - suppliedAllowedLag,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sessionDay: 100, reportedDay: 120, suppliedAllowedLag: 10 },
  output: { lagDays: 20, beyondAllowance: 10 },
} satisfies ToolExample<Input, Output>;
export const studySessionReportingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "acupuncture/study-session-reporting-gap",
    title: "Study Session Reporting Gap Tool",
    description:
      "Audit supplied research reporting timestamps without recommending session schedules or treatment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sessionDay: { type: "integer" },
        reportedDay: { type: "integer" },
        suppliedAllowedLag: { type: "integer", minimum: 0 },
      },
      required: ["sessionDay", "reportedDay", "suppliedAllowedLag"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lagDays: { type: "integer" },
        beyondAllowance: { type: "integer" },
      },
      required: ["lagDays", "beyondAllowance"],
    },
    ports: {
      inputs: [
        {
          id: "sessionDay",
          label: "Session Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reportedDay",
          label: "Reported Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedAllowedLag",
          label: "Supplied Allowed Lag",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "lagDays", label: "Lag Days", valueType: { type: "integer" } },
        {
          id: "beyondAllowance",
          label: "Beyond Allowance",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = studySessionReportingGapTool.execute;
export default studySessionReportingGapTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedArrivalCohort: string;
  readonly earningsPeriod: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedArrivalCohort: { type: "string", maxLength: 8192, minLength: 1 },
    earningsPeriod: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedArrivalCohort", "earningsPeriod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit arrival-cohort and earnings-period label without assigning migration status or estimating earnings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedArrivalCohort, earningsPeriod } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedArrivalCohort.length > 0, "suppliedArrivalCohort");
    H.domain(earningsPeriod.length > 0, "earningsPeriod");
    return {
      token: JSON.stringify([recordId, suppliedArrivalCohort, earningsPeriod]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedArrivalCohort: "2010-2014",
    earningsPeriod: "2025",
  },
  output: { token: '["R17","2010-2014","2025"]' },
} satisfies ToolExample<Input, Output>;
export const immigrantEarningsArrivalCohortLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "demographic-economics/immigrant-earnings-arrival-cohort-label",
      title: "Immigrant Earnings Arrival Cohort Label Tool",
      description:
        "Preserve an explicit arrival-cohort and earnings-period label without assigning migration status or estimating earnings.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedArrivalCohort: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          earningsPeriod: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "suppliedArrivalCohort", "earningsPeriod"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedArrivalCohort",
            label: "Supplied Arrival Cohort",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "earningsPeriod",
            label: "Earnings Period",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = immigrantEarningsArrivalCohortLabelTool.execute;
export default immigrantEarningsArrivalCohortLabelTool;

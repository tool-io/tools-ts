import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly accessionDate: string;
  readonly withdrawalDate: string;
  readonly asOfDate: string;
};
export type Output = { readonly partyAtDate: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accessionDate: { type: "string", maxLength: 8192 },
    withdrawalDate: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["accessionDate", "withdrawalDate", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { partyAtDate: { type: "boolean" } },
  required: ["partyAtDate"],
} as const;
/** Check a supplied treaty-party interval with inclusive accession and exclusive withdrawal dates. An empty withdrawal date means no recorded end; no treaty database is consulted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { accessionDate, withdrawalDate, asOfDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    const joined = namedDate(accessionDate, "accessionDate").getTime(),
      asOf = namedDate(asOfDate, "asOfDate").getTime();
    const left =
      withdrawalDate === ""
        ? Infinity
        : namedDate(withdrawalDate, "withdrawalDate").getTime();
    H.domain(left >= joined, "withdrawalDate");
    return { partyAtDate: asOf >= joined && asOf < left };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    accessionDate: "2020-01-01",
    withdrawalDate: "2026-10-01",
    asOfDate: "2026-10-01",
  },
  output: { partyAtDate: false },
} satisfies ToolExample<Input, Output>;
export const treatyPartyStatusAtDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/treaty-party-status-at-date",
    title: "Treaty Party Status At Date Tool",
    description:
      "Check a supplied treaty-party interval with inclusive accession and exclusive withdrawal dates. An empty withdrawal date means no recorded end; no treaty database is consulted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accessionDate: { type: "string", maxLength: 8192 },
        withdrawalDate: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["accessionDate", "withdrawalDate", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { partyAtDate: { type: "boolean" } },
      required: ["partyAtDate"],
    },
    ports: {
      inputs: [
        {
          id: "accessionDate",
          label: "Accession Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "withdrawalDate",
          label: "Withdrawal Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "partyAtDate",
          label: "Party At Date",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = treatyPartyStatusAtDateTool.execute;
export default treatyPartyStatusAtDateTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly clauseId: string;
  readonly effectiveDate: string;
  readonly asOfDate: string;
};
export type Output = { readonly effectiveByDate: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clauseId: { type: "string", maxLength: 8192 },
    effectiveDate: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["clauseId", "effectiveDate", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { effectiveByDate: { type: "boolean" } },
  required: ["effectiveByDate"],
} as const;
/** Compare a supplied clause effective date with an explicit as-of date without determining legal applicability or repeal status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { clauseId, effectiveDate, asOfDate } = request;
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
    H.domain(clauseId.length > 0, "clauseId");
    return {
      effectiveByDate:
        namedDate(asOfDate, "asOfDate").getTime() >=
        namedDate(effectiveDate, "effectiveDate").getTime(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    clauseId: "Art-4",
    effectiveDate: "2026-11-01",
    asOfDate: "2026-11-01",
  },
  output: { effectiveByDate: true },
} satisfies ToolExample<Input, Output>;
export const regulationClauseEffectiveDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/regulation-clause-effective-date",
    title: "Regulation Clause Effective Date Tool",
    description:
      "Compare a supplied clause effective date with an explicit as-of date without determining legal applicability or repeal status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clauseId: { type: "string", maxLength: 8192 },
        effectiveDate: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["clauseId", "effectiveDate", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { effectiveByDate: { type: "boolean" } },
      required: ["effectiveByDate"],
    },
    ports: {
      inputs: [
        {
          id: "clauseId",
          label: "Clause Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "effectiveDate",
          label: "Effective Date",
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
          id: "effectiveByDate",
          label: "Effective By Date",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = regulationClauseEffectiveDateTool.execute;
export default regulationClauseEffectiveDateTool;

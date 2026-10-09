import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assertionDate: string;
  readonly evidenceDate: string;
};
export type Output = {
  readonly evidencePredatesAssertion: boolean;
  readonly sameDate: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assertionDate: { type: "string", maxLength: 8192 },
    evidenceDate: { type: "string", maxLength: 8192 },
  },
  required: ["assertionDate", "evidenceDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    evidencePredatesAssertion: { type: "boolean" },
    sameDate: { type: "boolean" },
  },
  required: ["evidencePredatesAssertion", "sameDate"],
} as const;
/** Compare explicit assertion and evidence calendar dates without inferring whether evidence was available or considered. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assertionDate, evidenceDate } = request;
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
    return (() => {
      const assertion = namedDate(assertionDate, "assertionDate").getTime(),
        evidence = namedDate(evidenceDate, "evidenceDate").getTime();
      return {
        evidencePredatesAssertion: evidence < assertion,
        sameDate: evidence === assertion,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assertionDate: "2026-11-01", evidenceDate: "2026-10-28" },
  output: { evidencePredatesAssertion: true, sameDate: false },
} satisfies ToolExample<Input, Output>;
export const assertionEvidenceDateOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/assertion-evidence-date-order",
    title: "Assertion Evidence Date Order Tool",
    description:
      "Compare explicit assertion and evidence calendar dates without inferring whether evidence was available or considered.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assertionDate: { type: "string", maxLength: 8192 },
        evidenceDate: { type: "string", maxLength: 8192 },
      },
      required: ["assertionDate", "evidenceDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        evidencePredatesAssertion: { type: "boolean" },
        sameDate: { type: "boolean" },
      },
      required: ["evidencePredatesAssertion", "sameDate"],
    },
    ports: {
      inputs: [
        {
          id: "assertionDate",
          label: "Assertion Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "evidenceDate",
          label: "Evidence Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "evidencePredatesAssertion",
          label: "Evidence Predates Assertion",
          valueType: { type: "boolean" },
        },
        { id: "sameDate", label: "Same Date", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = assertionEvidenceDateOrderTool.execute;
export default assertionEvidenceDateOrderTool;

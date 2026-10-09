import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly asOfDate: string;
  readonly effectiveStartDate: string;
  readonly effectiveEndDate: string;
  readonly delegationRecorded: boolean;
};
export type Output = { readonly withinRecordedDelegation: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    asOfDate: { type: "string", maxLength: 8192 },
    effectiveStartDate: { type: "string", maxLength: 8192 },
    effectiveEndDate: { type: "string", maxLength: 8192 },
    delegationRecorded: { type: "boolean" },
  },
  required: [
    "asOfDate",
    "effectiveStartDate",
    "effectiveEndDate",
    "delegationRecorded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withinRecordedDelegation: { type: "boolean" } },
  required: ["withinRecordedDelegation"],
} as const;
/** Combine an explicit delegation flag with an inclusive recorded date window without assigning authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { asOfDate, effectiveStartDate, effectiveEndDate, delegationRecorded } =
    request;
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
    H.domain(
      namedDate(effectiveEndDate, "effectiveEndDate") >=
        namedDate(effectiveStartDate, "effectiveStartDate"),
      "effectiveEndDate",
    );
    namedDate(asOfDate, "asOfDate");
    return {
      withinRecordedDelegation:
        delegationRecorded &&
        namedDate(asOfDate, "asOfDate") >=
          namedDate(effectiveStartDate, "effectiveStartDate") &&
        namedDate(asOfDate, "asOfDate") <=
          namedDate(effectiveEndDate, "effectiveEndDate"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    asOfDate: "2026-11-01",
    effectiveStartDate: "2026-10-01",
    effectiveEndDate: "2026-12-01",
    delegationRecorded: true,
  },
  output: { withinRecordedDelegation: true },
} satisfies ToolExample<Input, Output>;
export const gcpDelegationTaskEffectiveFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "gcp",
        "good clinical practice",
        "research and quality management",
      ],
      keywords: [
        "good clinical practice",
        "research and quality management",
        "GCP",
      ],
    },
    id: "gcp/gcp-delegation-task-effective-flag",
    title: "GCP Delegation Task Effective Flag",
    description:
      "Combine an explicit delegation flag with an inclusive recorded date window without assigning authorization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        asOfDate: { type: "string", maxLength: 8192 },
        effectiveStartDate: { type: "string", maxLength: 8192 },
        effectiveEndDate: { type: "string", maxLength: 8192 },
        delegationRecorded: { type: "boolean" },
      },
      required: [
        "asOfDate",
        "effectiveStartDate",
        "effectiveEndDate",
        "delegationRecorded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { withinRecordedDelegation: { type: "boolean" } },
      required: ["withinRecordedDelegation"],
    },
    ports: {
      inputs: [
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "effectiveStartDate",
          label: "Effective Start Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "effectiveEndDate",
          label: "Effective End Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "delegationRecorded",
          label: "Delegation Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "withinRecordedDelegation",
          label: "Within Recorded Delegation",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = gcpDelegationTaskEffectiveFlagTool.execute;
export default gcpDelegationTaskEffectiveFlagTool;

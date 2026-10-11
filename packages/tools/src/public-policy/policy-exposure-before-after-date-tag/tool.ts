import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationDate: string;
  readonly suppliedEffectiveDate: string;
  readonly includeEffectiveAsAfter: boolean;
};
export type Output = { readonly periodTag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationDate: { type: "string", maxLength: 8192 },
    suppliedEffectiveDate: { type: "string", maxLength: 8192 },
    includeEffectiveAsAfter: { type: "boolean" },
  },
  required: [
    "observationDate",
    "suppliedEffectiveDate",
    "includeEffectiveAsAfter",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { periodTag: { type: "string", maxLength: 8192 } },
  required: ["periodTag"],
} as const;
/** Tag an explicit observation date relative to a supplied policy date under an explicit boundary convention without asserting exposure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationDate, suppliedEffectiveDate, includeEffectiveAsAfter } =
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
    return {
      periodTag: (
        includeEffectiveAsAfter
          ? namedDate(observationDate, "observationDate") >=
            namedDate(suppliedEffectiveDate, "suppliedEffectiveDate")
          : namedDate(observationDate, "observationDate") >
            namedDate(suppliedEffectiveDate, "suppliedEffectiveDate")
      )
        ? "after"
        : "before",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationDate: "2026-11-01",
    suppliedEffectiveDate: "2026-11-01",
    includeEffectiveAsAfter: true,
  },
  output: { periodTag: "after" },
} satisfies ToolExample<Input, Output>;
export const policyExposureBeforeAfterDateTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["public-policy", "public policy", "social sciences"],
      keywords: ["public policy", "social sciences"],
    },
    id: "public-policy/policy-exposure-before-after-date-tag",
    title: "Policy Exposure Before After Date Tag",
    description:
      "Tag an explicit observation date relative to a supplied policy date under an explicit boundary convention without asserting exposure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationDate: { type: "string", maxLength: 8192 },
        suppliedEffectiveDate: { type: "string", maxLength: 8192 },
        includeEffectiveAsAfter: { type: "boolean" },
      },
      required: [
        "observationDate",
        "suppliedEffectiveDate",
        "includeEffectiveAsAfter",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { periodTag: { type: "string", maxLength: 8192 } },
      required: ["periodTag"],
    },
    ports: {
      inputs: [
        {
          id: "observationDate",
          label: "Observation Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedEffectiveDate",
          label: "Supplied Effective Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "includeEffectiveAsAfter",
          label: "Include Effective As After",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "periodTag", label: "Period Tag", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = policyExposureBeforeAfterDateTagTool.execute;
export default policyExposureBeforeAfterDateTagTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly presentSignatoryIds: readonly string[];
  readonly authorizedSignatoryIds: readonly string[];
  readonly requiredDistinctCount: number;
};
export type Output = {
  readonly distinctAuthorizedCount: number;
  readonly meetsCount: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentSignatoryIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    authorizedSignatoryIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredDistinctCount: { type: "integer", minimum: 0 },
  },
  required: [
    "presentSignatoryIds",
    "authorizedSignatoryIds",
    "requiredDistinctCount",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distinctAuthorizedCount: { type: "integer" },
    meetsCount: { type: "boolean" },
  },
  required: ["distinctAuthorizedCount", "meetsCount"],
} as const;
/** Count distinct present identifiers appearing in an explicit authorized list and compare with a supplied required count without validating signatures. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { presentSignatoryIds, authorizedSignatoryIds, requiredDistinctCount } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(requiredDistinctCount) &&
        requiredDistinctCount >= 0 &&
        requiredDistinctCount <= Number.MAX_SAFE_INTEGER,
      "requiredDistinctCount",
    ),
      requiredDistinctCount);
    return (() => {
      const distinctAuthorizedCount = new Set(
        presentSignatoryIds.filter((id) => authorizedSignatoryIds.includes(id)),
      ).size;
      return {
        distinctAuthorizedCount,
        meetsCount: distinctAuthorizedCount >= requiredDistinctCount,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    presentSignatoryIds: ["A", "A", "B"],
    authorizedSignatoryIds: ["A", "B"],
    requiredDistinctCount: 2,
  },
  output: { distinctAuthorizedCount: 2, meetsCount: true },
} satisfies ToolExample<Input, Output>;
export const authorizedSignatoryCountRuleTool = H.defineSchemaCalculation<
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
    id: "business-administration/authorized-signatory-count-rule",
    title: "Authorized Signatory Count Rule",
    description:
      "Count distinct present identifiers appearing in an explicit authorized list and compare with a supplied required count without validating signatures.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presentSignatoryIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        authorizedSignatoryIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredDistinctCount: { type: "integer", minimum: 0 },
      },
      required: [
        "presentSignatoryIds",
        "authorizedSignatoryIds",
        "requiredDistinctCount",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distinctAuthorizedCount: { type: "integer" },
        meetsCount: { type: "boolean" },
      },
      required: ["distinctAuthorizedCount", "meetsCount"],
    },
    ports: {
      inputs: [
        {
          id: "presentSignatoryIds",
          label: "Present Signatory Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "authorizedSignatoryIds",
          label: "Authorized Signatory Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requiredDistinctCount",
          label: "Required Distinct Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "distinctAuthorizedCount",
          label: "Distinct Authorized Count",
          valueType: { type: "integer" },
        },
        {
          id: "meetsCount",
          label: "Meets Count",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = authorizedSignatoryCountRuleTool.execute;
export default authorizedSignatoryCountRuleTool;

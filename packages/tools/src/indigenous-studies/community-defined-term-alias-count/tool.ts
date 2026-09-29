import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly termIds: readonly string[];
  readonly aliasLabels: readonly string[];
  readonly authorized: readonly boolean[];
  readonly selectedTerm: string;
};
export type Output = {
  readonly authorizedAliases: number;
  readonly unauthorizedRecords: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    termIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    aliasLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    authorized: { type: "array", maxItems: 256, items: { type: "boolean" } },
    selectedTerm: { type: "string", maxLength: 8192 },
  },
  required: ["termIds", "aliasLabels", "authorized", "selectedTerm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authorizedAliases: { type: "integer" },
    unauthorizedRecords: { type: "integer" },
  },
  required: ["authorizedAliases", "unauthorizedRecords"],
} as const;
/** Count explicitly authorized community-defined aliases without generating or publishing restricted vocabulary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { termIds, aliasLabels, authorized, selectedTerm } = request;
  const compute = (): Output => {
    H.sameLength(termIds, aliasLabels);
    H.sameLength(aliasLabels, authorized);
    return {
      authorizedAliases: new Set(
        aliasLabels.filter(
          (x, i) => termIds[i] === selectedTerm && authorized[i],
        ),
      ).size,
      unauthorizedRecords: termIds.filter(
        (x, i) => x === selectedTerm && !authorized[i],
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    termIds: ["t", "t", "t"],
    aliasLabels: ["a", "a", "b"],
    authorized: [true, true, false],
    selectedTerm: "t",
  },
  output: { authorizedAliases: 1, unauthorizedRecords: 1 },
} satisfies ToolExample<Input, Output>;
export const communityDefinedTermAliasCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "indigenous-studies/community-defined-term-alias-count",
    title: "Community Defined Term Alias Count Tool",
    description:
      "Count explicitly authorized community-defined aliases without generating or publishing restricted vocabulary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        termIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        aliasLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        authorized: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        selectedTerm: { type: "string", maxLength: 8192 },
      },
      required: ["termIds", "aliasLabels", "authorized", "selectedTerm"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        authorizedAliases: { type: "integer" },
        unauthorizedRecords: { type: "integer" },
      },
      required: ["authorizedAliases", "unauthorizedRecords"],
    },
    ports: {
      inputs: [
        {
          id: "termIds",
          label: "Term Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "aliasLabels",
          label: "Alias Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "authorized",
          label: "Authorized",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "selectedTerm",
          label: "Selected Term",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "authorizedAliases",
          label: "Authorized Aliases",
          valueType: { type: "integer" },
        },
        {
          id: "unauthorizedRecords",
          label: "Unauthorized Records",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = communityDefinedTermAliasCountTool.execute;
export default communityDefinedTermAliasCountTool;

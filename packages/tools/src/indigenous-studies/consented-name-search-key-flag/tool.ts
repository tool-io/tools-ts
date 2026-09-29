import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly name: string;
  readonly consented: boolean;
  readonly withdrawn: boolean;
  readonly suppliedKey: string;
};
export type Output = {
  readonly includeInSearch: boolean;
  readonly searchKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", maxLength: 8192 },
    consented: { type: "boolean" },
    withdrawn: { type: "boolean" },
    suppliedKey: { type: "string", maxLength: 8192 },
  },
  required: ["name", "consented", "withdrawn", "suppliedKey"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    includeInSearch: { type: "boolean" },
    searchKey: { type: "string", maxLength: 8192 },
  },
  required: ["includeInSearch", "searchKey"],
} as const;
/** Gate a caller-supplied name search key using explicit consent flags, without storing or publishing a name. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { name, consented, withdrawn, suppliedKey } = request;
  const compute = (): Output => {
    const includeInSearch = consented && !withdrawn;
    H.domain(name.length > 0);
    return { includeInSearch, searchKey: includeInSearch ? suppliedKey : "" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    name: "Name A",
    consented: true,
    withdrawn: false,
    suppliedKey: "key-A",
  },
  output: { includeInSearch: true, searchKey: "key-A" },
} satisfies ToolExample<Input, Output>;
export const consentedNameSearchKeyFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "indigenous-studies/consented-name-search-key-flag",
    title: "Consented Name Search Key Flag Tool",
    description:
      "Gate a caller-supplied name search key using explicit consent flags, without storing or publishing a name.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string", maxLength: 8192 },
        consented: { type: "boolean" },
        withdrawn: { type: "boolean" },
        suppliedKey: { type: "string", maxLength: 8192 },
      },
      required: ["name", "consented", "withdrawn", "suppliedKey"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        includeInSearch: { type: "boolean" },
        searchKey: { type: "string", maxLength: 8192 },
      },
      required: ["includeInSearch", "searchKey"],
    },
    ports: {
      inputs: [
        {
          id: "name",
          label: "Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "consented",
          label: "Consented",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "withdrawn",
          label: "Withdrawn",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedKey",
          label: "Supplied Key",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "includeInSearch",
          label: "Include In Search",
          valueType: { type: "boolean" },
        },
        { id: "searchKey", label: "Search Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = consentedNameSearchKeyFlagTool.execute;
export default consentedNameSearchKeyFlagTool;

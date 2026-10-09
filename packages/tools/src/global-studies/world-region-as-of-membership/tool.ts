import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly countryCode: string;
  readonly regionMembers: readonly string[];
  readonly sourceVintage: string;
};
export type Output = { readonly listed: boolean; readonly sourceLabel: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countryCode: { type: "string", maxLength: 8192, minLength: 1 },
    regionMembers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceVintage: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["countryCode", "regionMembers", "sourceVintage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    listed: { type: "boolean" },
    sourceLabel: { type: "string", maxLength: 8192 },
  },
  required: ["listed", "sourceLabel"],
} as const;
/** Check literal membership in a caller-supplied regional grouping with its explicit source vintage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { countryCode, regionMembers, sourceVintage } = request;
  const compute = (): Output => {
    H.domain(countryCode.length > 0 && sourceVintage.length > 0, "countryCode");
    return {
      listed: regionMembers.includes(countryCode),
      sourceLabel: sourceVintage,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    countryCode: "AA",
    regionMembers: ["AA", "BB"],
    sourceVintage: "List A 2026",
  },
  output: { listed: true, sourceLabel: "List A 2026" },
} satisfies ToolExample<Input, Output>;
export const worldRegionAsOfMembershipTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["global-studies", "global studies", "social sciences"],
      keywords: ["global studies", "social sciences"],
    },
    id: "global-studies/world-region-as-of-membership",
    title: "World Region As Of Membership",
    description:
      "Check literal membership in a caller-supplied regional grouping with its explicit source vintage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countryCode: { type: "string", maxLength: 8192, minLength: 1 },
        regionMembers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceVintage: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["countryCode", "regionMembers", "sourceVintage"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        listed: { type: "boolean" },
        sourceLabel: { type: "string", maxLength: 8192 },
      },
      required: ["listed", "sourceLabel"],
    },
    ports: {
      inputs: [
        {
          id: "countryCode",
          label: "Country Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "regionMembers",
          label: "Region Members",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceVintage",
          label: "Source Vintage",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "listed", label: "Listed", valueType: { type: "boolean" } },
        {
          id: "sourceLabel",
          label: "Source Label",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = worldRegionAsOfMembershipTool.execute;
export default worldRegionAsOfMembershipTool;

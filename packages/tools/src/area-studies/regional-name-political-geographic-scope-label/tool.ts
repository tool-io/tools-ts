import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regionId: string;
  readonly suppliedName: string;
  readonly scopeCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regionId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedName: { type: "string", maxLength: 8192, minLength: 1 },
    scopeCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["regionId", "suppliedName", "scopeCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied regional name and explicit scope code without equating geographic and political boundaries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regionId, suppliedName, scopeCode } = request;
  const compute = (): Output => {
    H.domain(regionId.length > 0, "regionId");
    H.domain(suppliedName.length > 0, "suppliedName");
    H.domain(scopeCode.length > 0, "scopeCode");
    return { token: JSON.stringify([regionId, suppliedName, scopeCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    regionId: "R17",
    suppliedName: "Northern region",
    scopeCode: "geographic",
  },
  output: { token: '["R17","Northern region","geographic"]' },
} satisfies ToolExample<Input, Output>;
export const regionalNamePoliticalGeographicScopeLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["area-studies", "area studies", "humanities"],
        keywords: ["area studies", "humanities"],
      },
      id: "area-studies/regional-name-political-geographic-scope-label",
      title: "Regional Name Political Geographic Scope Label",
      description:
        "Record a supplied regional name and explicit scope code without equating geographic and political boundaries.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          regionId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedName: { type: "string", maxLength: 8192, minLength: 1 },
          scopeCode: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["regionId", "suppliedName", "scopeCode"],
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
            id: "regionId",
            label: "Region Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedName",
            label: "Supplied Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "scopeCode",
            label: "Scope Code",
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
export const run = regionalNamePoliticalGeographicScopeLabelTool.execute;
export default regionalNamePoliticalGeographicScopeLabelTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caseCode: string;
  readonly definitionSource: string;
  readonly definitionVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseCode: { type: "string", maxLength: 8192, minLength: 1 },
    definitionSource: { type: "string", maxLength: 8192, minLength: 1 },
    definitionVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["caseCode", "definitionSource", "definitionVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Attach an explicit surveillance definition source and version without classifying a case. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caseCode, definitionSource, definitionVersion } = request;
  const compute = (): Output => {
    H.domain(caseCode.length > 0, "caseCode");
    H.domain(definitionSource.length > 0, "definitionSource");
    H.domain(definitionVersion.length > 0, "definitionVersion");
    return {
      token: JSON.stringify([caseCode, definitionSource, definitionVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    caseCode: "CASE17",
    definitionSource: "Protocol A",
    definitionVersion: "v3",
  },
  output: { token: '["CASE17","Protocol A","v3"]' },
} satisfies ToolExample<Input, Output>;
export const surveillanceCaseDefinitionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["epidemiology", "health and medicine"],
      keywords: ["epidemiology", "health and medicine"],
    },
    id: "epidemiology/surveillance-case-definition-label",
    title: "Surveillance Case Definition Label",
    description:
      "Attach an explicit surveillance definition source and version without classifying a case.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caseCode: { type: "string", maxLength: 8192, minLength: 1 },
        definitionSource: { type: "string", maxLength: 8192, minLength: 1 },
        definitionVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["caseCode", "definitionSource", "definitionVersion"],
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
          id: "caseCode",
          label: "Case Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "definitionSource",
          label: "Definition Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "definitionVersion",
          label: "Definition Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = surveillanceCaseDefinitionLabelTool.execute;
export default surveillanceCaseDefinitionLabelTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly codeId: string;
  readonly edition: string;
  readonly clauseText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    codeId: { type: "string", maxLength: 8192, minLength: 1 },
    edition: { type: "string", maxLength: 8192, minLength: 1 },
    clauseText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["codeId", "edition", "clauseText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit professional-code clause locator by edition without retrieving or interpreting the clause. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { codeId, edition, clauseText } = request;
  const compute = (): Output => {
    H.domain(codeId.length > 0, "codeId");
    H.domain(edition.length > 0, "edition");
    H.domain(clauseText.length > 0, "clauseText");
    return { token: JSON.stringify([codeId, edition, clauseText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { codeId: "CODE17", edition: "v2", clauseText: "3.2(b)" },
  output: { token: '["CODE17","v2","3.2(b)"]' },
} satisfies ToolExample<Input, Output>;
export const professionalCodeClauseLocatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["ethics", "philosophy"],
      keywords: ["ethics", "philosophy"],
    },
    id: "ethics/professional-code-clause-locator",
    title: "Professional Code Clause Locator",
    description:
      "Qualify an explicit professional-code clause locator by edition without retrieving or interpreting the clause.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        codeId: { type: "string", maxLength: 8192, minLength: 1 },
        edition: { type: "string", maxLength: 8192, minLength: 1 },
        clauseText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["codeId", "edition", "clauseText"],
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
          id: "codeId",
          label: "Code Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "clauseText",
          label: "Clause Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = professionalCodeClauseLocatorTool.execute;
export default professionalCodeClauseLocatorTool;

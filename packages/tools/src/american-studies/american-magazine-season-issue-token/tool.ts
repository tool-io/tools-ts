import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly serialId: string;
  readonly suppliedSeasonText: string;
  readonly issueText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    serialId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSeasonText: { type: "string", maxLength: 8192, minLength: 1 },
    issueText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["serialId", "suppliedSeasonText", "issueText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify explicit magazine season-issue wording without converting seasons to dates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { serialId, suppliedSeasonText, issueText } = request;
  const compute = (): Output => {
    H.domain(serialId.length > 0, "serialId");
    H.domain(suppliedSeasonText.length > 0, "suppliedSeasonText");
    H.domain(issueText.length > 0, "issueText");
    return { token: JSON.stringify([serialId, suppliedSeasonText, issueText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    serialId: "SER17",
    suppliedSeasonText: "Spring 1950",
    issueText: "No. 2",
  },
  output: { token: '["SER17","Spring 1950","No. 2"]' },
} satisfies ToolExample<Input, Output>;
export const americanMagazineSeasonissueTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["american-studies", "american studies", "humanities"],
      keywords: ["american studies", "humanities"],
    },
    id: "american-studies/american-magazine-season-issue-token",
    title: "American Magazine Season and Issue Token",
    description:
      "Qualify explicit magazine season-issue wording without converting seasons to dates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        serialId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedSeasonText: { type: "string", maxLength: 8192, minLength: 1 },
        issueText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["serialId", "suppliedSeasonText", "issueText"],
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
          id: "serialId",
          label: "Serial Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSeasonText",
          label: "Supplied Season Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "issueText",
          label: "Issue Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = americanMagazineSeasonissueTokenTool.execute;
export default americanMagazineSeasonissueTokenTool;

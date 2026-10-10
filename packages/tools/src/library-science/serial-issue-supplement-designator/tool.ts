import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly serialId: string;
  readonly issueText: string;
  readonly supplementText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    serialId: { type: "string", maxLength: 8192, minLength: 1 },
    issueText: { type: "string", maxLength: 8192, minLength: 1 },
    supplementText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["serialId", "issueText", "supplementText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit serial supplement by parent issue without resolving bibliographic identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { serialId, issueText, supplementText } = request;
  const compute = (): Output => {
    H.domain(serialId.length > 0, "serialId");
    H.domain(issueText.length > 0, "issueText");
    H.domain(supplementText.length > 0, "supplementText");
    return { token: JSON.stringify([serialId, issueText, supplementText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    serialId: "SER17",
    issueText: "12(3)",
    supplementText: "Supplement A",
  },
  output: { token: '["SER17","12(3)","Supplement A"]' },
} satisfies ToolExample<Input, Output>;
export const serialIssueSupplementDesignatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "library-science",
        "library science",
        "information and language sciences",
      ],
      keywords: ["library science", "information and language sciences"],
    },
    id: "library-science/serial-issue-supplement-designator",
    title: "Serial Issue Supplement Designator",
    description:
      "Qualify an explicit serial supplement by parent issue without resolving bibliographic identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        serialId: { type: "string", maxLength: 8192, minLength: 1 },
        issueText: { type: "string", maxLength: 8192, minLength: 1 },
        supplementText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["serialId", "issueText", "supplementText"],
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
          id: "issueText",
          label: "Issue Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "supplementText",
          label: "Supplement Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = serialIssueSupplementDesignatorTool.execute;
export default serialIssueSupplementDesignatorTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volume: string;
  readonly issue: string;
  readonly supplement: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "string", maxLength: 8192 },
    issue: { type: "string", maxLength: 8192 },
    supplement: { type: "string", maxLength: 8192 },
  },
  required: ["volume", "issue", "supplement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format supplied volume, issue and supplement tokens using an explicit compact bibliographic convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volume, issue, supplement } = request;
  const compute = (): Output => {
    H.domain(volume.length > 0);
    return {
      label:
        volume +
        (issue ? "(" + issue + ")" : "") +
        (supplement ? " Suppl " + supplement : ""),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volume: "12", issue: "3", supplement: "2" },
  output: { label: "12(3) Suppl 2" },
} satisfies ToolExample<Input, Output>;
export const journalIssueSpecialSupplementLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/journal-issue-special-supplement-label",
    title: "Journal Issue Special Supplement Label Tool",
    description:
      "Format supplied volume, issue and supplement tokens using an explicit compact bibliographic convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volume: { type: "string", maxLength: 8192 },
        issue: { type: "string", maxLength: 8192 },
        supplement: { type: "string", maxLength: 8192 },
      },
      required: ["volume", "issue", "supplement"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "issue",
          label: "Issue",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "supplement",
          label: "Supplement",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = journalIssueSpecialSupplementLabelTool.execute;
export default journalIssueSpecialSupplementLabelTool;

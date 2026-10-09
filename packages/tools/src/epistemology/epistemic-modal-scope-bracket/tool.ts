import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly modalToken: string;
  readonly propositionText: string;
};
export type Output = { readonly scopedText: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modalToken: { type: "string", maxLength: 8192, minLength: 1 },
    propositionText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["modalToken", "propositionText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scopedText: { type: "string", maxLength: 8192 } },
  required: ["scopedText"],
} as const;
/** Wrap an explicit proposition text in a supplied epistemic modal token without parsing logic or evaluating truth. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { modalToken, propositionText } = request;
  const compute = (): Output => {
    H.domain(modalToken.length > 0, "modalToken");
    H.domain(propositionText.length > 0, "propositionText");
    return { scopedText: modalToken + "(" + propositionText + ")" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { modalToken: "K_a", propositionText: "p ∧ q" },
  output: { scopedText: "K_a(p ∧ q)" },
} satisfies ToolExample<Input, Output>;
export const epistemicModalScopeBracketTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/epistemic-modal-scope-bracket",
    title: "Epistemic Modal Scope Bracket Tool",
    description:
      "Wrap an explicit proposition text in a supplied epistemic modal token without parsing logic or evaluating truth.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modalToken: { type: "string", maxLength: 8192, minLength: 1 },
        propositionText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["modalToken", "propositionText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scopedText: { type: "string", maxLength: 8192 } },
      required: ["scopedText"],
    },
    ports: {
      inputs: [
        {
          id: "modalToken",
          label: "Modal Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "propositionText",
          label: "Proposition Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "scopedText",
          label: "Scoped Text",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = epistemicModalScopeBracketTool.execute;
export default epistemicModalScopeBracketTool;

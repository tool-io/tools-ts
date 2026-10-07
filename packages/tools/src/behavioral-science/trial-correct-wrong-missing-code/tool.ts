import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly observed: boolean; readonly correct: boolean };
export type Output = { readonly code: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { observed: { type: "boolean" }, correct: { type: "boolean" } },
  required: ["observed", "correct"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { code: { type: "string", maxLength: 8192 } },
  required: ["code"],
} as const;
/** Encode a trial’s explicit observation and correctness flags without converting missing responses into errors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, correct } = request;
  const compute = (): Output => {
    return { code: !observed ? "missing" : correct ? "correct" : "wrong" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: true, correct: false },
  output: { code: "wrong" },
} satisfies ToolExample<Input, Output>;
export const trialCorrectWrongMissingCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["behavioral-science", "behavioral science", "psychology"],
      keywords: ["behavioral science", "psychology"],
    },
    id: "behavioral-science/trial-correct-wrong-missing-code",
    title: "Trial Correct Wrong Missing Code",
    description:
      "Encode a trial’s explicit observation and correctness flags without converting missing responses into errors.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "boolean" },
        correct: { type: "boolean" },
      },
      required: ["observed", "correct"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { code: { type: "string", maxLength: 8192 } },
      required: ["code"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "correct",
          label: "Correct",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "code", label: "Code", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = trialCorrectWrongMissingCodeTool.execute;
export default trialCorrectWrongMissingCodeTool;

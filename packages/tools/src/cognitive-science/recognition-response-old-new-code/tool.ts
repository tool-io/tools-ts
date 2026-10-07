import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly trialId: string; readonly response: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trialId: { type: "string", maxLength: 8192, minLength: 1 },
    response: {
      type: "string",
      maxLength: 8192,
      enum: ["old", "new", "uncertain", "omitted"],
    },
  },
  required: ["trialId", "response"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied recognition response without judging correctness or memory performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trialId, response } = request;
  const compute = (): Output => {
    H.domain(trialId.length > 0, "trialId");
    H.domain(
      ["old", "new", "uncertain", "omitted"].includes(response),
      "response",
    );
    return { label: trialId + " [" + response + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trialId: "T17", response: "old" },
  output: { label: "T17 [old]" },
} satisfies ToolExample<Input, Output>;
export const recognitionResponseOldNewCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["cognitive-science", "cognitive science", "psychology"],
      keywords: ["cognitive science", "psychology"],
    },
    id: "cognitive-science/recognition-response-old-new-code",
    title: "Recognition Response Old New Code",
    description:
      "Label an explicitly supplied recognition response without judging correctness or memory performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trialId: { type: "string", maxLength: 8192, minLength: 1 },
        response: {
          type: "string",
          maxLength: 8192,
          enum: ["old", "new", "uncertain", "omitted"],
        },
      },
      required: ["trialId", "response"],
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
          id: "trialId",
          label: "Trial Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "response",
          label: "Response",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = recognitionResponseOldNewCodeTool.execute;
export default recognitionResponseOldNewCodeTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fileConditionCode: string;
  readonly assignedConditionCode: string;
};
export type Output = { readonly matches: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fileConditionCode: { type: "string", maxLength: 8192, minLength: 1 },
    assignedConditionCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["fileConditionCode", "assignedConditionCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matches: { type: "boolean" } },
  required: ["matches"],
} as const;
/** Compare exact supplied stimulus-file and assigned condition codes without reading a file or inferring task conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fileConditionCode, assignedConditionCode } = request;
  const compute = (): Output => {
    H.domain(fileConditionCode.length > 0, "fileConditionCode");
    H.domain(assignedConditionCode.length > 0, "assignedConditionCode");
    return { matches: fileConditionCode === assignedConditionCode };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fileConditionCode: "A", assignedConditionCode: "A" },
  output: { matches: true },
} satisfies ToolExample<Input, Output>;
export const stimulusFileConditionCodeMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/stimulus-file-condition-code-match",
    title: "Stimulus File Condition Code Match Tool",
    description:
      "Compare exact supplied stimulus-file and assigned condition codes without reading a file or inferring task conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fileConditionCode: { type: "string", maxLength: 8192, minLength: 1 },
        assignedConditionCode: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: ["fileConditionCode", "assignedConditionCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { matches: { type: "boolean" } },
      required: ["matches"],
    },
    ports: {
      inputs: [
        {
          id: "fileConditionCode",
          label: "File Condition Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assignedConditionCode",
          label: "Assigned Condition Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = stimulusFileConditionCodeMatchTool.execute;
export default stimulusFileConditionCodeMatchTool;

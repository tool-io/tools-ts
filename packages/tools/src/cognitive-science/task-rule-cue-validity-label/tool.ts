import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trialId: string;
  readonly cueCode: string;
  readonly suppliedValidity: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trialId: { type: "string", maxLength: 8192, minLength: 1 },
    cueCode: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedValidity: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["trialId", "cueCode", "suppliedValidity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit task-rule cue and supplied validity code without inferring attention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trialId, cueCode, suppliedValidity } = request;
  const compute = (): Output => {
    H.domain(trialId.length > 0, "trialId");
    H.domain(cueCode.length > 0, "cueCode");
    H.domain(suppliedValidity.length > 0, "suppliedValidity");
    return { token: JSON.stringify([trialId, cueCode, suppliedValidity]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trialId: "T17", cueCode: "C4", suppliedValidity: "valid" },
  output: { token: '["T17","C4","valid"]' },
} satisfies ToolExample<Input, Output>;
export const taskRuleCueValidityLabelTool = H.defineSchemaCalculation<
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
    id: "cognitive-science/task-rule-cue-validity-label",
    title: "Task Rule Cue Validity Label",
    description:
      "Preserve an explicit task-rule cue and supplied validity code without inferring attention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trialId: { type: "string", maxLength: 8192, minLength: 1 },
        cueCode: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedValidity: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["trialId", "cueCode", "suppliedValidity"],
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
          id: "trialId",
          label: "Trial Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "cueCode",
          label: "Cue Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedValidity",
          label: "Supplied Validity",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = taskRuleCueValidityLabelTool.execute;
export default taskRuleCueValidityLabelTool;

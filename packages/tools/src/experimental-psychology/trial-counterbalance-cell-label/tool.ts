import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyCode: string;
  readonly factorALevel: string;
  readonly factorBLevel: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyCode: { type: "string", maxLength: 8192, minLength: 1 },
    factorALevel: { type: "string", maxLength: 8192, minLength: 1 },
    factorBLevel: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["studyCode", "factorALevel", "factorBLevel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Construct a literal counterbalancing cell key from two supplied factor-level codes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyCode, factorALevel, factorBLevel } = request;
  const compute = (): Output => {
    H.domain(studyCode.length > 0, "studyCode");
    H.domain(factorALevel.length > 0, "factorALevel");
    H.domain(factorBLevel.length > 0, "factorBLevel");
    return { token: JSON.stringify([studyCode, factorALevel, factorBLevel]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studyCode: "ST17", factorALevel: "left", factorBLevel: "blue" },
  output: { token: '["ST17","left","blue"]' },
} satisfies ToolExample<Input, Output>;
export const trialCounterbalanceCellLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "experimental-psychology",
        "experimental psychology",
        "psychology",
      ],
      keywords: ["experimental psychology", "psychology"],
    },
    id: "experimental-psychology/trial-counterbalance-cell-label",
    title: "Trial Counterbalance Cell Label",
    description:
      "Construct a literal counterbalancing cell key from two supplied factor-level codes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyCode: { type: "string", maxLength: 8192, minLength: 1 },
        factorALevel: { type: "string", maxLength: 8192, minLength: 1 },
        factorBLevel: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["studyCode", "factorALevel", "factorBLevel"],
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
          id: "studyCode",
          label: "Study Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "factorALevel",
          label: "Factor ALevel",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "factorBLevel",
          label: "Factor BLevel",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = trialCounterbalanceCellLabelTool.execute;
export default trialCounterbalanceCellLabelTool;

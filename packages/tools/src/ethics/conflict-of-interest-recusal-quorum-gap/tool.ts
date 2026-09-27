import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly present: number;
  readonly recusals: number;
  readonly required: number;
};
export type Output = {
  readonly eligible: number;
  readonly margin: number;
  readonly quorumByInputs: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    present: { type: "integer", minimum: 0 },
    recusals: { type: "integer", minimum: 0 },
    required: { type: "integer", minimum: 0 },
  },
  required: ["present", "recusals", "required"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "integer" },
    margin: { type: "integer" },
    quorumByInputs: { type: "boolean" },
  },
  required: ["eligible", "margin", "quorumByInputs"],
} as const;
/** Calculate conflict of interest recusal quorum gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { present, recusals, required } = request;
  const compute = (): Output => {
    H.integer(present, 0);
    H.integer(recusals, 0, present);
    H.integer(required, 0);
    return {
      eligible: present - recusals,
      margin: present - recusals - required,
      quorumByInputs: present - recusals >= required,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { present: 8, recusals: 2, required: 5 },
  output: { eligible: 6, margin: 1, quorumByInputs: true },
} satisfies ToolExample<Input, Output>;
export const conflictOfInterestRecusalQuorumGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/conflict-of-interest-recusal-quorum-gap",
    title: "Conflict Of Interest Recusal Quorum Gap Tool",
    description:
      "Calculate conflict of interest recusal quorum gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        present: { type: "integer", minimum: 0 },
        recusals: { type: "integer", minimum: 0 },
        required: { type: "integer", minimum: 0 },
      },
      required: ["present", "recusals", "required"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligible: { type: "integer" },
        margin: { type: "integer" },
        quorumByInputs: { type: "boolean" },
      },
      required: ["eligible", "margin", "quorumByInputs"],
    },
    ports: {
      inputs: [
        {
          id: "present",
          label: "Present",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recusals",
          label: "Recusals",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "eligible", label: "Eligible", valueType: { type: "integer" } },
        { id: "margin", label: "Margin", valueType: { type: "integer" } },
        {
          id: "quorumByInputs",
          label: "Quorum By Inputs",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = conflictOfInterestRecusalQuorumGapTool.execute;
export default conflictOfInterestRecusalQuorumGapTool;

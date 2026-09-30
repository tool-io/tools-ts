import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly present: number;
  readonly recused: number;
  readonly quorum: number;
  readonly vetoExercised: boolean;
};
export type Output = {
  readonly eligible: number;
  readonly quorumMargin: number;
  readonly proceeds: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    present: { type: "integer", minimum: 0 },
    recused: { type: "integer", minimum: 0 },
    quorum: { type: "integer", minimum: 0 },
    vetoExercised: { type: "boolean" },
  },
  required: ["present", "recused", "quorum", "vetoExercised"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "integer" },
    quorumMargin: { type: "integer" },
    proceeds: { type: "boolean" },
  },
  required: ["eligible", "quorumMargin", "proceeds"],
} as const;
/** Calculate decision veto quorum gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { present, recused, quorum, vetoExercised } = request;
  const compute = (): Output => {
    H.integer(present, 0);
    H.integer(recused, 0, present);
    H.integer(quorum, 0);
    return {
      eligible: present - recused,
      quorumMargin: present - recused - quorum,
      proceeds: present - recused >= quorum && !vetoExercised,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { present: 8, recused: 1, quorum: 6, vetoExercised: false },
  output: { eligible: 7, quorumMargin: 1, proceeds: true },
} satisfies ToolExample<Input, Output>;
export const decisionVetoQuorumGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/decision-veto-quorum-gap",
    title: "Decision Veto Quorum Gap Tool",
    description:
      "Calculate decision veto quorum gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        present: { type: "integer", minimum: 0 },
        recused: { type: "integer", minimum: 0 },
        quorum: { type: "integer", minimum: 0 },
        vetoExercised: { type: "boolean" },
      },
      required: ["present", "recused", "quorum", "vetoExercised"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligible: { type: "integer" },
        quorumMargin: { type: "integer" },
        proceeds: { type: "boolean" },
      },
      required: ["eligible", "quorumMargin", "proceeds"],
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
          id: "recused",
          label: "Recused",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "quorum",
          label: "Quorum",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "vetoExercised",
          label: "Veto Exercised",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "eligible", label: "Eligible", valueType: { type: "integer" } },
        {
          id: "quorumMargin",
          label: "Quorum Margin",
          valueType: { type: "integer" },
        },
        { id: "proceeds", label: "Proceeds", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = decisionVetoQuorumGapTool.execute;
export default decisionVetoQuorumGapTool;

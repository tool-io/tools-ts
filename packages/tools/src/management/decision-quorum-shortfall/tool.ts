import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly present: number; readonly required: number };
export type Output = {
  readonly shortfall: number;
  readonly meetsQuorum: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    present: { type: "integer", minimum: 0 },
    required: { type: "integer", minimum: 0 },
  },
  required: ["present", "required"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shortfall: { type: "integer" },
    meetsQuorum: { type: "boolean" },
  },
  required: ["shortfall", "meetsQuorum"],
} as const;
/** Calculate decision quorum shortfall from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { present, required } = request;
  const compute = (): Output => {
    H.integer(present, 0);
    H.integer(required, 0);
    return {
      shortfall: Math.max(0, required - present),
      meetsQuorum: present >= required,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { present: 6, required: 8 },
  output: { shortfall: 2, meetsQuorum: false },
} satisfies ToolExample<Input, Output>;
export const decisionQuorumShortfallTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/decision-quorum-shortfall",
    title: "Decision Quorum Shortfall Tool",
    description:
      "Calculate decision quorum shortfall from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        present: { type: "integer", minimum: 0 },
        required: { type: "integer", minimum: 0 },
      },
      required: ["present", "required"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shortfall: { type: "integer" },
        meetsQuorum: { type: "boolean" },
      },
      required: ["shortfall", "meetsQuorum"],
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
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "shortfall", label: "Shortfall", valueType: { type: "integer" } },
        {
          id: "meetsQuorum",
          label: "Meets Quorum",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = decisionQuorumShortfallTool.execute;
export default decisionQuorumShortfallTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly members: number;
  readonly recused: number;
  readonly absent: number;
  readonly overlap: number;
  readonly required: number;
};
export type Output = {
  readonly available: number;
  readonly shortfall: number;
  readonly quorum: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    members: { type: "integer", minimum: 0 },
    recused: { type: "integer", minimum: 0 },
    absent: { type: "integer", minimum: 0 },
    overlap: { type: "integer", minimum: 0 },
    required: { type: "integer", minimum: 0 },
  },
  required: ["members", "recused", "absent", "overlap", "required"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    available: { type: "integer" },
    shortfall: { type: "integer" },
    quorum: { type: "boolean" },
  },
  required: ["available", "shortfall", "quorum"],
} as const;
/** Count supplied overlapping recusals and absences against a caller-specified quorum. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { members, recused, absent, overlap, required } = request;
  const compute = (): Output => {
    H.integer(members, 0);
    H.integer(recused, 0, members);
    H.integer(absent, 0, members);
    H.integer(overlap, 0, Math.min(recused, absent));
    H.integer(required, 0);
    H.domain(recused + absent - overlap <= members);
    return {
      available: members - recused - absent + overlap,
      shortfall: Math.max(0, required - members + recused + absent - overlap),
      quorum: members - recused - absent + overlap >= required,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { members: 10, recused: 2, absent: 3, overlap: 1, required: 7 },
  output: { available: 6, shortfall: 1, quorum: false },
} satisfies ToolExample<Input, Output>;
export const qaRoleRecusalQuorumGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/qa-role-recusal-quorum-gap",
    title: "QA Role Recusal Quorum Gap Tool",
    description:
      "Count supplied overlapping recusals and absences against a caller-specified quorum.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        members: { type: "integer", minimum: 0 },
        recused: { type: "integer", minimum: 0 },
        absent: { type: "integer", minimum: 0 },
        overlap: { type: "integer", minimum: 0 },
        required: { type: "integer", minimum: 0 },
      },
      required: ["members", "recused", "absent", "overlap", "required"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        available: { type: "integer" },
        shortfall: { type: "integer" },
        quorum: { type: "boolean" },
      },
      required: ["available", "shortfall", "quorum"],
    },
    ports: {
      inputs: [
        {
          id: "members",
          label: "Members",
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
          id: "absent",
          label: "Absent",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "overlap",
          label: "Overlap",
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
        { id: "available", label: "Available", valueType: { type: "integer" } },
        { id: "shortfall", label: "Shortfall", valueType: { type: "integer" } },
        { id: "quorum", label: "Quorum", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = qaRoleRecusalQuorumGapTool.execute;
export default qaRoleRecusalQuorumGapTool;

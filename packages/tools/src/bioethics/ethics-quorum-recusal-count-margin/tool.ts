import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly members: number;
  readonly absent: number;
  readonly recusedPresent: number;
  readonly required: number;
};
export type Output = {
  readonly eligiblePresent: number;
  readonly margin: number;
  readonly reachesSuppliedQuorum: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    members: { type: "integer", minimum: 0 },
    absent: { type: "integer", minimum: 0 },
    recusedPresent: { type: "integer", minimum: 0 },
    required: { type: "integer", minimum: 0 },
  },
  required: ["members", "absent", "recusedPresent", "required"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligiblePresent: { type: "integer" },
    margin: { type: "integer" },
    reachesSuppliedQuorum: { type: "boolean" },
  },
  required: ["eligiblePresent", "margin", "reachesSuppliedQuorum"],
} as const;
/** Calculate ethics quorum recusal count margin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { members, absent, recusedPresent, required } = request;
  const compute = (): Output => {
    H.integer(members, 0);
    H.integer(absent, 0, members);
    H.integer(recusedPresent, 0, members - absent);
    H.integer(required, 0);
    return {
      eligiblePresent: members - absent - recusedPresent,
      margin: members - absent - recusedPresent - required,
      reachesSuppliedQuorum: members - absent - recusedPresent >= required,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { members: 12, absent: 2, recusedPresent: 3, required: 7 },
  output: { eligiblePresent: 7, margin: 0, reachesSuppliedQuorum: true },
} satisfies ToolExample<Input, Output>;
export const ethicsQuorumRecusalCountMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/ethics-quorum-recusal-count-margin",
    title: "Ethics Quorum Recusal Count Margin Tool",
    description:
      "Calculate ethics quorum recusal count margin from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        members: { type: "integer", minimum: 0 },
        absent: { type: "integer", minimum: 0 },
        recusedPresent: { type: "integer", minimum: 0 },
        required: { type: "integer", minimum: 0 },
      },
      required: ["members", "absent", "recusedPresent", "required"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligiblePresent: { type: "integer" },
        margin: { type: "integer" },
        reachesSuppliedQuorum: { type: "boolean" },
      },
      required: ["eligiblePresent", "margin", "reachesSuppliedQuorum"],
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
          id: "absent",
          label: "Absent",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recusedPresent",
          label: "Recused Present",
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
        {
          id: "eligiblePresent",
          label: "Eligible Present",
          valueType: { type: "integer" },
        },
        { id: "margin", label: "Margin", valueType: { type: "integer" } },
        {
          id: "reachesSuppliedQuorum",
          label: "Reaches Supplied Quorum",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = ethicsQuorumRecusalCountMarginTool.execute;
export default ethicsQuorumRecusalCountMarginTool;

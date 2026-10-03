import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldRank: number;
  readonly insertedRank: number;
  readonly alreadyPresent: boolean;
};
export type Output = { readonly newRank: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldRank: { type: "integer", minimum: 0 },
    insertedRank: { type: "integer", minimum: 0 },
    alreadyPresent: { type: "boolean" },
  },
  required: ["oldRank", "insertedRank", "alreadyPresent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { newRank: { type: "integer" } },
  required: ["newRank"],
} as const;
/** Calculate finite set rank after one insertion from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldRank, insertedRank, alreadyPresent } = request;
  const compute = (): Output => {
    H.integer(oldRank, 0);
    H.integer(insertedRank, 0);
    return {
      newRank: oldRank + (!alreadyPresent && insertedRank <= oldRank ? 1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oldRank: 3, insertedRank: 2, alreadyPresent: false },
  output: { newRank: 4 },
} satisfies ToolExample<Input, Output>;
export const finiteSetRankAfterOneInsertionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/finite-set-rank-after-one-insertion",
    title: "Finite Set Rank After One Insertion Tool",
    description:
      "Calculate finite set rank after one insertion from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldRank: { type: "integer", minimum: 0 },
        insertedRank: { type: "integer", minimum: 0 },
        alreadyPresent: { type: "boolean" },
      },
      required: ["oldRank", "insertedRank", "alreadyPresent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { newRank: { type: "integer" } },
      required: ["newRank"],
    },
    ports: {
      inputs: [
        {
          id: "oldRank",
          label: "Old Rank",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "insertedRank",
          label: "Inserted Rank",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "alreadyPresent",
          label: "Already Present",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "newRank", label: "New Rank", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = finiteSetRankAfterOneInsertionTool.execute;
export default finiteSetRankAfterOneInsertionTool;

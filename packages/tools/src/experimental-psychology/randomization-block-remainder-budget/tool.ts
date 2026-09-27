import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedTrials: number;
  readonly blockSize: number;
  readonly completedTrials: number;
};
export type Output = {
  readonly fullBlocks: number;
  readonly remainder: number;
  readonly trialsToNextBoundary: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedTrials: { type: "integer", minimum: 0 },
    blockSize: { type: "integer", minimum: 1 },
    completedTrials: { type: "integer", minimum: 0 },
  },
  required: ["plannedTrials", "blockSize", "completedTrials"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullBlocks: { type: "integer" },
    remainder: { type: "integer" },
    trialsToNextBoundary: { type: "integer" },
  },
  required: ["fullBlocks", "remainder", "trialsToNextBoundary"],
} as const;
/** Deterministic block accounting; this does not generate a random assignment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedTrials, blockSize, completedTrials } = request;
  const compute = (): Output => {
    H.integer(plannedTrials, 0);
    H.integer(blockSize, 1);
    H.integer(completedTrials, 0, plannedTrials);
    return {
      fullBlocks: Math.floor((plannedTrials - completedTrials) / blockSize),
      remainder: (plannedTrials - completedTrials) % blockSize,
      trialsToNextBoundary:
        completedTrials % blockSize === 0
          ? 0
          : blockSize - (completedTrials % blockSize),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plannedTrials: 100, blockSize: 8, completedTrials: 25 },
  output: { fullBlocks: 9, remainder: 3, trialsToNextBoundary: 7 },
} satisfies ToolExample<Input, Output>;
export const randomizationBlockRemainderBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/randomization-block-remainder-budget",
    title: "Randomization Block Remainder Budget Tool",
    description:
      "Deterministic block accounting; this does not generate a random assignment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedTrials: { type: "integer", minimum: 0 },
        blockSize: { type: "integer", minimum: 1 },
        completedTrials: { type: "integer", minimum: 0 },
      },
      required: ["plannedTrials", "blockSize", "completedTrials"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullBlocks: { type: "integer" },
        remainder: { type: "integer" },
        trialsToNextBoundary: { type: "integer" },
      },
      required: ["fullBlocks", "remainder", "trialsToNextBoundary"],
    },
    ports: {
      inputs: [
        {
          id: "plannedTrials",
          label: "Planned Trials",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "blockSize",
          label: "Block Size",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "completedTrials",
          label: "Completed Trials",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "fullBlocks",
          label: "Full Blocks",
          valueType: { type: "integer" },
        },
        { id: "remainder", label: "Remainder", valueType: { type: "integer" } },
        {
          id: "trialsToNextBoundary",
          label: "Trials To Next Boundary",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = randomizationBlockRemainderBudgetTool.execute;
export default randomizationBlockRemainderBudgetTool;

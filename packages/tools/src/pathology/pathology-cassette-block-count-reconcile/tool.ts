import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cassettes: number;
  readonly plannedBlocksPerCassette: number;
  readonly createdBlocks: number;
  readonly exhaustedBlocks: number;
};
export type Output = {
  readonly expectedBlocks: number;
  readonly missingBlocks: number;
  readonly remainingCreated: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cassettes: { type: "integer", minimum: 0 },
    plannedBlocksPerCassette: { type: "integer", minimum: 1 },
    createdBlocks: { type: "integer", minimum: 0 },
    exhaustedBlocks: { type: "integer", minimum: 0 },
  },
  required: [
    "cassettes",
    "plannedBlocksPerCassette",
    "createdBlocks",
    "exhaustedBlocks",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedBlocks: { type: "integer" },
    missingBlocks: { type: "integer" },
    remainingCreated: { type: "integer" },
  },
  required: ["expectedBlocks", "missingBlocks", "remainingCreated"],
} as const;
/** Calculate pathology cassette block count reconcile from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    cassettes,
    plannedBlocksPerCassette,
    createdBlocks,
    exhaustedBlocks,
  } = request;
  const compute = (): Output => {
    H.integer(cassettes, 0);
    H.integer(plannedBlocksPerCassette, 1);
    H.integer(createdBlocks, 0);
    H.integer(exhaustedBlocks, 0, createdBlocks);
    return {
      expectedBlocks: cassettes * plannedBlocksPerCassette,
      missingBlocks: cassettes * plannedBlocksPerCassette - createdBlocks,
      remainingCreated: createdBlocks - exhaustedBlocks,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cassettes: 10,
    plannedBlocksPerCassette: 2,
    createdBlocks: 18,
    exhaustedBlocks: 3,
  },
  output: { expectedBlocks: 20, missingBlocks: 2, remainingCreated: 15 },
} satisfies ToolExample<Input, Output>;
export const pathologyCassetteBlockCountReconcileTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pathology/pathology-cassette-block-count-reconcile",
      title: "Pathology Cassette Block Count Reconcile Tool",
      description:
        "Calculate pathology cassette block count reconcile from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cassettes: { type: "integer", minimum: 0 },
          plannedBlocksPerCassette: { type: "integer", minimum: 1 },
          createdBlocks: { type: "integer", minimum: 0 },
          exhaustedBlocks: { type: "integer", minimum: 0 },
        },
        required: [
          "cassettes",
          "plannedBlocksPerCassette",
          "createdBlocks",
          "exhaustedBlocks",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expectedBlocks: { type: "integer" },
          missingBlocks: { type: "integer" },
          remainingCreated: { type: "integer" },
        },
        required: ["expectedBlocks", "missingBlocks", "remainingCreated"],
      },
      ports: {
        inputs: [
          {
            id: "cassettes",
            label: "Cassettes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "plannedBlocksPerCassette",
            label: "Planned Blocks Per Cassette",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "createdBlocks",
            label: "Created Blocks",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "exhaustedBlocks",
            label: "Exhausted Blocks",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "expectedBlocks",
            label: "Expected Blocks",
            valueType: { type: "integer" },
          },
          {
            id: "missingBlocks",
            label: "Missing Blocks",
            valueType: { type: "integer" },
          },
          {
            id: "remainingCreated",
            label: "Remaining Created",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pathologyCassetteBlockCountReconcileTool.execute;
export default pathologyCassetteBlockCountReconcileTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly blockSizes: readonly number[];
  readonly universeSize: number;
};
export type Output = {
  readonly assignedDecimal: string;
  readonly residualDecimal: string;
  readonly matchesSize: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blockSizes: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    universeSize: { type: "integer", minimum: 0 },
  },
  required: ["blockSizes", "universeSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assignedDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    residualDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    matchesSize: { type: "boolean" },
  },
  required: ["assignedDecimal", "residualDecimal", "matchesSize"],
} as const;
/** Check cardinality balance of supplied partition block sizes without claiming their disjointness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { blockSizes, universeSize } = request;
  const compute = (): Output => {
    H.integer(universeSize, 0);
    H.domain(blockSizes.every((x) => x >= 0));
    return (() => {
      const assigned = blockSizes.reduce((s, x) => s + BigInt(x), 0n),
        residual = BigInt(universeSize) - assigned;
      return {
        assignedDecimal: assigned.toString(),
        residualDecimal: residual.toString(),
        matchesSize: residual === 0n,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { blockSizes: [2, 3], universeSize: 6 },
  output: { assignedDecimal: "5", residualDecimal: "1", matchesSize: false },
} satisfies ToolExample<Input, Output>;
export const partitionBlockSizeResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/partition-block-size-residual",
    title: "Partition Block Size Residual Tool",
    description:
      "Check cardinality balance of supplied partition block sizes without claiming their disjointness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blockSizes: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        universeSize: { type: "integer", minimum: 0 },
      },
      required: ["blockSizes", "universeSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assignedDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        residualDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        matchesSize: { type: "boolean" },
      },
      required: ["assignedDecimal", "residualDecimal", "matchesSize"],
    },
    ports: {
      inputs: [
        {
          id: "blockSizes",
          label: "Block Sizes",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "universeSize",
          label: "Universe Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "assignedDecimal",
          label: "Assigned Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "residualDecimal",
          label: "Residual Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "matchesSize",
          label: "Matches Size",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = partitionBlockSizeResidualTool.execute;
export default partitionBlockSizeResidualTool;

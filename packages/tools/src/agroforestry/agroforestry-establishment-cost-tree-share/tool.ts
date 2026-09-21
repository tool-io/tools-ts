import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trees: number;
  readonly perTree: number;
  readonly sharedCost: number;
  readonly grant: number;
};
export type Output = {
  readonly totalCost: number;
  readonly netPerTree: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trees: { type: "integer", minimum: 1 },
    perTree: { type: "number", minimum: 0 },
    sharedCost: { type: "number", minimum: 0 },
    grant: { type: "number", minimum: 0 },
  },
  required: ["trees", "perTree", "sharedCost", "grant"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalCost: { type: "number" }, netPerTree: { type: "number" } },
  required: ["totalCost", "netPerTree"],
} as const;
/** Calculate agroforestry establishment cost tree share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trees, perTree, sharedCost, grant } = request;
  const compute = (): Output => {
    H.integer(trees, 1);
    H.domain(perTree >= 0 && sharedCost >= 0 && grant >= 0);
    return {
      totalCost: trees * perTree + sharedCost - grant,
      netPerTree: perTree + (sharedCost - grant) / trees,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trees: 100, perTree: 5, sharedCost: 200, grant: 100 },
  output: { totalCost: 600, netPerTree: 6 },
} satisfies ToolExample<Input, Output>;
export const agroforestryEstablishmentCostTreeShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agroforestry/agroforestry-establishment-cost-tree-share",
      title: "Agroforestry Establishment Cost Tree Share Tool",
      description:
        "Calculate agroforestry establishment cost tree share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          trees: { type: "integer", minimum: 1 },
          perTree: { type: "number", minimum: 0 },
          sharedCost: { type: "number", minimum: 0 },
          grant: { type: "number", minimum: 0 },
        },
        required: ["trees", "perTree", "sharedCost", "grant"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalCost: { type: "number" },
          netPerTree: { type: "number" },
        },
        required: ["totalCost", "netPerTree"],
      },
      ports: {
        inputs: [
          {
            id: "trees",
            label: "Trees",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "perTree",
            label: "Per Tree",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sharedCost",
            label: "Shared Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "grant",
            label: "Grant",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "totalCost",
            label: "Total Cost",
            valueType: { type: "number" },
          },
          {
            id: "netPerTree",
            label: "Net Per Tree",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = agroforestryEstablishmentCostTreeShareTool.execute;
export default agroforestryEstablishmentCostTreeShareTool;

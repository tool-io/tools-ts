import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly populations: readonly number[];
  readonly perPersonCosts: readonly number[];
  readonly included: readonly boolean[];
};
export type Output = {
  readonly totalCost: number;
  readonly includedCost: number;
  readonly includedShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    populations: { type: "array", maxItems: 256, items: { type: "number" } },
    perPersonCosts: { type: "array", maxItems: 256, items: { type: "number" } },
    included: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["populations", "perPersonCosts", "included"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCost: { type: "number" },
    includedCost: { type: "number" },
    includedShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["totalCost", "includedCost", "includedShare", "defined"],
} as const;
/** Calculate pollution cost population share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { populations, perPersonCosts, included } = request;
  const compute = (): Output => {
    H.sameLength(populations, perPersonCosts);
    H.sameLength(populations, included);
    H.domain([...populations, ...perPersonCosts].every((x) => x >= 0));
    return (() => {
      const totalCost = populations.reduce(
          (s, x, i) => s + x * perPersonCosts[i],
          0,
        ),
        includedCost = populations.reduce(
          (s, x, i) => s + (included[i] ? x * perPersonCosts[i] : 0),
          0,
        );
      return {
        totalCost,
        includedCost,
        includedShare: totalCost > 0 ? includedCost / totalCost : 0,
        defined: totalCost > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    populations: [10, 20],
    perPersonCosts: [2, 3],
    included: [true, false],
  },
  output: {
    totalCost: 80,
    includedCost: 20,
    includedShare: 0.25,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const pollutionCostPopulationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/pollution-cost-population-share",
    title: "Pollution Cost Population Share Tool",
    description:
      "Calculate pollution cost population share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        populations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        perPersonCosts: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        included: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["populations", "perPersonCosts", "included"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalCost: { type: "number" },
        includedCost: { type: "number" },
        includedShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["totalCost", "includedCost", "includedShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "populations",
          label: "Populations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "perPersonCosts",
          label: "Per Person Costs",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "included",
          label: "Included",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "totalCost", label: "Total Cost", valueType: { type: "number" } },
        {
          id: "includedCost",
          label: "Included Cost",
          valueType: { type: "number" },
        },
        {
          id: "includedShare",
          label: "Included Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = pollutionCostPopulationShareTool.execute;
export default pollutionCostPopulationShareTool;

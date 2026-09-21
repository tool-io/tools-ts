import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trees: number;
  readonly dryMassEach: number;
  readonly carbonFraction: number;
  readonly belowgroundFactor: number;
};
export type Output = { readonly carbonMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trees: { type: "integer", minimum: 0 },
    dryMassEach: { type: "number", minimum: 0 },
    carbonFraction: { type: "number", minimum: 0, maximum: 1 },
    belowgroundFactor: { type: "number", minimum: 0 },
  },
  required: ["trees", "dryMassEach", "carbonFraction", "belowgroundFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { carbonMass: { type: "number" } },
  required: ["carbonMass"],
} as const;
/** One supplied cohort carbon inventory under an explicit root/shoot factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trees, dryMassEach, carbonFraction, belowgroundFactor } = request;
  const compute = (): Output => {
    H.integer(trees, 0);
    H.domain(dryMassEach >= 0 && belowgroundFactor >= 0);
    H.probability(carbonFraction);
    return {
      carbonMass:
        trees * dryMassEach * carbonFraction * (1 + belowgroundFactor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    trees: 100,
    dryMassEach: 20,
    carbonFraction: 0.5,
    belowgroundFactor: 0.2,
  },
  output: { carbonMass: 1200 },
} satisfies ToolExample<Input, Output>;
export const agroforestryCarbonStockOneCohortTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/agroforestry-carbon-stock-one-cohort",
    title: "Agroforestry Carbon Stock One Cohort Tool",
    description:
      "One supplied cohort carbon inventory under an explicit root/shoot factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trees: { type: "integer", minimum: 0 },
        dryMassEach: { type: "number", minimum: 0 },
        carbonFraction: { type: "number", minimum: 0, maximum: 1 },
        belowgroundFactor: { type: "number", minimum: 0 },
      },
      required: ["trees", "dryMassEach", "carbonFraction", "belowgroundFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { carbonMass: { type: "number" } },
      required: ["carbonMass"],
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
          id: "dryMassEach",
          label: "Dry Mass Each",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "carbonFraction",
          label: "Carbon Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "belowgroundFactor",
          label: "Belowground Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "carbonMass",
          label: "Carbon Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = agroforestryCarbonStockOneCohortTool.execute;
export default agroforestryCarbonStockOneCohortTool;

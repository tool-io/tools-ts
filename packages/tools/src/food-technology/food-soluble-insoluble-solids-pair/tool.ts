import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalSolidsMass: number;
  readonly solubleSolidsMass: number;
};
export type Output = {
  readonly insolubleSolidsMass: number;
  readonly solubleShareOfSolids: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalSolidsMass: { type: "number", exclusiveMinimum: 0 },
    solubleSolidsMass: { type: "number", minimum: 0 },
  },
  required: ["totalSolidsMass", "solubleSolidsMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    insolubleSolidsMass: { type: "number" },
    solubleShareOfSolids: { type: "number" },
  },
  required: ["insolubleSolidsMass", "solubleShareOfSolids"],
} as const;
/** Partition explicit total solids into supplied soluble and residual insoluble masses without inferring composition from refractometry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalSolidsMass, solubleSolidsMass } = request;
  const compute = (): Output => {
    (H.domain(totalSolidsMass > 0, "totalSolidsMass"), totalSolidsMass);
    H.domain(
      solubleSolidsMass >= 0 && solubleSolidsMass <= totalSolidsMass,
      "solubleSolidsMass",
    );
    return {
      insolubleSolidsMass: totalSolidsMass - solubleSolidsMass,
      solubleShareOfSolids: solubleSolidsMass / totalSolidsMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalSolidsMass: 40, solubleSolidsMass: 10 },
  output: { insolubleSolidsMass: 30, solubleShareOfSolids: 0.25 },
} satisfies ToolExample<Input, Output>;
export const foodSolubleInsolubleSolidsPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "food-technology",
        "food technology",
        "research and quality management",
      ],
      keywords: ["food technology", "research and quality management"],
    },
    id: "food-technology/food-soluble-insoluble-solids-pair",
    title: "Food Soluble Insoluble Solids Pair",
    description:
      "Partition explicit total solids into supplied soluble and residual insoluble masses without inferring composition from refractometry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalSolidsMass: { type: "number", exclusiveMinimum: 0 },
        solubleSolidsMass: { type: "number", minimum: 0 },
      },
      required: ["totalSolidsMass", "solubleSolidsMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        insolubleSolidsMass: { type: "number" },
        solubleShareOfSolids: { type: "number" },
      },
      required: ["insolubleSolidsMass", "solubleShareOfSolids"],
    },
    ports: {
      inputs: [
        {
          id: "totalSolidsMass",
          label: "Total Solids Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solubleSolidsMass",
          label: "Soluble Solids Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "insolubleSolidsMass",
          label: "Insoluble Solids Mass",
          valueType: { type: "number" },
        },
        {
          id: "solubleShareOfSolids",
          label: "Soluble Share Of Solids",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodSolubleInsolubleSolidsPairTool.execute;
export default foodSolubleInsolubleSolidsPairTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceYield: number;
  readonly treeInfluence: number;
  readonly suppliedCoefficient: number;
};
export type Output = {
  readonly conditionalYield: number;
  readonly change: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceYield: { type: "number", minimum: 0 },
    treeInfluence: { type: "number", minimum: 0 },
    suppliedCoefficient: { type: "number" },
  },
  required: ["referenceYield", "treeInfluence", "suppliedCoefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditionalYield: { type: "number" },
    change: { type: "number" },
  },
  required: ["conditionalYield", "change"],
} as const;
/** One caller-calibrated linear response scenario without a universal competition model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceYield, treeInfluence, suppliedCoefficient } = request;
  const compute = (): Output => {
    H.domain(
      referenceYield >= 0 &&
        treeInfluence >= 0 &&
        1 - suppliedCoefficient * treeInfluence >= 0,
    );
    return {
      conditionalYield:
        referenceYield * (1 - suppliedCoefficient * treeInfluence),
      change: -referenceYield * suppliedCoefficient * treeInfluence,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceYield: 100, treeInfluence: 0.2, suppliedCoefficient: 0.5 },
  output: { conditionalYield: 90, change: -10 },
} satisfies ToolExample<Input, Output>;
export const treeCropCompetitionCallerResponseTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agroforestry/tree-crop-competition-caller-response-term",
      title: "Tree Crop Competition Caller Response Term Tool",
      description:
        "One caller-calibrated linear response scenario without a universal competition model.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceYield: { type: "number", minimum: 0 },
          treeInfluence: { type: "number", minimum: 0 },
          suppliedCoefficient: { type: "number" },
        },
        required: ["referenceYield", "treeInfluence", "suppliedCoefficient"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conditionalYield: { type: "number" },
          change: { type: "number" },
        },
        required: ["conditionalYield", "change"],
      },
      ports: {
        inputs: [
          {
            id: "referenceYield",
            label: "Reference Yield",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "treeInfluence",
            label: "Tree Influence",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedCoefficient",
            label: "Supplied Coefficient",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "conditionalYield",
            label: "Conditional Yield",
            valueType: { type: "number" },
          },
          { id: "change", label: "Change", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = treeCropCompetitionCallerResponseTermTool.execute;
export default treeCropCompetitionCallerResponseTermTool;

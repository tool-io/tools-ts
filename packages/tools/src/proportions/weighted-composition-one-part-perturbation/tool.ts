import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly part: number;
  readonly total: number;
  readonly change: number;
};
export type Output = {
  readonly newFraction: number;
  readonly fractionChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    part: { type: "number", minimum: 0 },
    total: { type: "number" },
    change: { type: "number" },
  },
  required: ["part", "total", "change"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newFraction: { type: "number" },
    fractionChange: { type: "number" },
  },
  required: ["newFraction", "fractionChange"],
} as const;
/** Calculate weighted composition one part perturbation from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { part, total, change } = input;
  const compute = (): Output => {
    H.domain(part >= 0 && total >= part && part + change >= 0);
    H.positive(total + change);
    const newFraction = (part + change) / (total + change);
    return { newFraction, fractionChange: newFraction - part / total };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { part: 20, total: 100, change: 25 },
  output: { newFraction: 0.36, fractionChange: 0.15999999999999998 },
} satisfies ToolExample<Input, Output>;
export const weightedCompositionOnePartPerturbationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "proportions/weighted-composition-one-part-perturbation",
      title: "Weighted Composition One Part Perturbation Tool",
      description:
        "Calculate weighted composition one part perturbation from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          part: { type: "number", minimum: 0 },
          total: { type: "number" },
          change: { type: "number" },
        },
        required: ["part", "total", "change"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          newFraction: { type: "number" },
          fractionChange: { type: "number" },
        },
        required: ["newFraction", "fractionChange"],
      },
      ports: {
        inputs: [
          {
            id: "part",
            label: "Part",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "total",
            label: "Total",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "change",
            label: "Change",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "newFraction",
            label: "New Fraction",
            valueType: { type: "number" },
          },
          {
            id: "fractionChange",
            label: "Fraction Change",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = weightedCompositionOnePartPerturbationTool.execute;
export default weightedCompositionOnePartPerturbationTool;

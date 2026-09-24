import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly universe: number;
  readonly subset: number;
  readonly increment: number;
};
export type Output = {
  readonly complement: number;
  readonly changedComplement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    universe: { type: "integer", minimum: 0 },
    subset: { type: "integer", minimum: 0 },
    increment: { type: "integer" },
  },
  required: ["universe", "subset", "increment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    complement: { type: "integer" },
    changedComplement: { type: "integer" },
  },
  required: ["complement", "changedComplement"],
} as const;
/** Calculate subset complement cardinality shift from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { universe, subset, increment } = input;
  const compute = (): Output => {
    H.integer(universe, 0);
    H.integer(subset, 0, universe);
    H.integer(subset + increment, 0, universe);
    return {
      complement: universe - subset,
      changedComplement: universe - subset - increment,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { universe: 10, subset: 3, increment: 2 },
  output: { complement: 7, changedComplement: 5 },
} satisfies ToolExample<Input, Output>;
export const subsetComplementCardinalityShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/subset-complement-cardinality-shift",
    title: "Subset Complement Cardinality Shift Tool",
    description:
      "Calculate subset complement cardinality shift from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        universe: { type: "integer", minimum: 0 },
        subset: { type: "integer", minimum: 0 },
        increment: { type: "integer" },
      },
      required: ["universe", "subset", "increment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        complement: { type: "integer" },
        changedComplement: { type: "integer" },
      },
      required: ["complement", "changedComplement"],
    },
    ports: {
      inputs: [
        {
          id: "universe",
          label: "Universe",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "subset",
          label: "Subset",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "increment",
          label: "Increment",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "complement",
          label: "Complement",
          valueType: { type: "integer" },
        },
        {
          id: "changedComplement",
          label: "Changed Complement",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = subsetComplementCardinalityShiftTool.execute;
export default subsetComplementCardinalityShiftTool;

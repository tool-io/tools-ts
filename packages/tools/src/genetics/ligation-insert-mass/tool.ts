import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { count, positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly vectorMassNg: number;
  readonly vectorLengthBp: number;
  readonly insertLengthBp: number;
  readonly desiredInsertVectorMolarRatio: number;
}>;
export type Output = Readonly<{
  readonly requiredInsertMassNg: number;
  readonly totalDnaMassNg: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.vectorMassNg, "vectorMassNg");
  count(input.vectorLengthBp, "vectorLengthBp", 1);
  count(input.insertLengthBp, "insertLengthBp", 1);
  positive(
    input.desiredInsertVectorMolarRatio,
    "desiredInsertVectorMolarRatio",
  );
  const requiredInsertMassNg =
    ((input.vectorMassNg * input.insertLengthBp) / input.vectorLengthBp) *
    input.desiredInsertVectorMolarRatio;
  return {
    requiredInsertMassNg,
    totalDnaMassNg: input.vectorMassNg + requiredInsertMassNg,
  };
};
export const exampleInput = {
  vectorMassNg: 100,
  vectorLengthBp: 1000,
  insertLengthBp: 500,
  desiredInsertVectorMolarRatio: 3,
} satisfies Input;
export const exampleOutput = {
  requiredInsertMassNg: 150,
  totalDnaMassNg: 250,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/ligation-insert-mass",
  title: "Ligation Insert Mass",
  description:
    "Convert a desired insert/vector molar ratio into DNA insert mass using fragment lengths.",
  inputs: [
    { id: "vectorMassNg", label: "Vector mass ng", kind: "number" },
    { id: "vectorLengthBp", label: "Vector length bp", kind: "integer" },
    { id: "insertLengthBp", label: "Insert length bp", kind: "integer" },
    {
      id: "desiredInsertVectorMolarRatio",
      label: "Desired insert vector molar ratio",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "requiredInsertMassNg",
      label: "Required insert mass ng",
      kind: "number",
    },
    { id: "totalDnaMassNg", label: "Total dna mass ng", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      vectorMassNg: value.vectorMassNg as number,
      vectorLengthBp: value.vectorLengthBp as number,
      insertLengthBp: value.insertLengthBp as number,
      desiredInsertVectorMolarRatio:
        value.desiredInsertVectorMolarRatio as number,
    }),
});
export const run = tool.execute;
export default tool;

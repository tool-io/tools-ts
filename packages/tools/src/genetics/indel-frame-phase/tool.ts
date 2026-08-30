import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly insertedBases: number;
  readonly deletedBases: number;
}>;
export type Output = Readonly<{
  readonly netLengthChange: number;
  readonly phaseShift: number;
  readonly frameshift: boolean;
}>;
export const calculate = (input: Input): Output => {
  count(input.insertedBases, "insertedBases");
  count(input.deletedBases, "deletedBases");
  const netLengthChange = input.insertedBases - input.deletedBases,
    phaseShift = ((netLengthChange % 3) + 3) % 3;
  return { netLengthChange, phaseShift, frameshift: phaseShift !== 0 };
};
export const exampleInput = {
  insertedBases: 4,
  deletedBases: 1,
} satisfies Input;
export const exampleOutput = {
  netLengthChange: 3,
  phaseShift: 0,
  frameshift: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/indel-frame-phase",
  title: "Indel Frame Phase",
  description: "Classify net indel coding-phase disruption by modulo three.",
  inputs: [
    { id: "insertedBases", label: "Inserted bases", kind: "integer" },
    { id: "deletedBases", label: "Deleted bases", kind: "integer" },
  ],
  outputs: [
    { id: "netLengthChange", label: "Net length change", kind: "number" },
    { id: "phaseShift", label: "Phase shift", kind: "number" },
    { id: "frameshift", label: "Frameshift", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      insertedBases: value.insertedBases as number,
      deletedBases: value.deletedBases as number,
    }),
});
export const run = tool.execute;
export default tool;

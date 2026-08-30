import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly acetate: number;
  readonly propionate: number;
  readonly butyrate: number;
}>;
export type Output = Readonly<{
  readonly total: number;
  readonly molePercents: readonly number[];
  readonly dominantAcid: string;
}>;
export const calculate = (input: Input): Output => {
  if (Math.min(input.acetate, input.propionate, input.butyrate) < 0)
    simpleError("acetate", "SCFA amounts must be nonnegative.");
  const total = input.acetate + input.propionate + input.butyrate;
  if (total <= 0) simpleError("acetate", "SCFA total must be positive.");
  const items = [input.acetate, input.propionate, input.butyrate],
    names = ["acetate", "propionate", "butyrate"];
  return {
    total,
    molePercents: items.map((v) => (v / total) * 100),
    dominantAcid: names[items.indexOf(Math.max(...items))],
  };
};
export const exampleInput = {
  acetate: 2,
  propionate: 3,
  butyrate: 5,
} satisfies Input;
export const exampleOutput = {
  total: 10,
  molePercents: [20, 30, 50],
  dominantAcid: "butyrate",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/scfa-composition",
  title: "SCFA Composition",
  description: "Calculate acetate–propionate–butyrate molar percentages.",
  inputs: [
    { id: "acetate", kind: "number", label: "Acetate" },
    { id: "propionate", kind: "number", label: "Propionate" },
    { id: "butyrate", kind: "number", label: "Butyrate" },
  ],
  outputs: [
    { id: "total", kind: "number", label: "Total" },
    { id: "molePercents", kind: "numberList", label: "Mole percents" },
    { id: "dominantAcid", kind: "string", label: "Dominant acid" },
  ],
  calculate: (value) =>
    calculate({
      acetate: value.acetate as number,
      propionate: value.propionate as number,
      butyrate: value.butyrate as number,
    }),
});
export const run = tool.execute;
export default tool;

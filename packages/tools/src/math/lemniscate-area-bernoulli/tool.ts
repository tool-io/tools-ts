import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch-shared.js";
export type Input = Readonly<{ readonly lemniscateScale: number }>;
export type Output = Readonly<{
  readonly totalBothLobesArea: number;
  readonly oneLobeArea: number;
}>;
const inputFields = [
  { id: "lemniscateScale", label: "Lemniscate scale", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.lemniscateScale, "lemniscateScale");
  return {
    totalBothLobesArea: input.lemniscateScale ** 2,
    oneLobeArea: input.lemniscateScale ** 2 / 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { lemniscateScale: 2 } satisfies Input;
export const exampleOutput = {
  totalBothLobesArea: 4,
  oneLobeArea: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/lemniscate-area-bernoulli",
  title: "Bernoulli Lemniscate Area Calculator",
  description:
    "Compute both-lobe and individual-lobe area for Bernoulli lemniscate r²=a² cos(2θ); scale is polar maximum radius, not focal half-distance.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalBothLobesArea",
      label: "Total both lobes area",
      kind: "number",
    },
    { id: "oneLobeArea", label: "One lobe area", kind: "number" },
  ],
  calculate: (value) =>
    calculate({ lemniscateScale: value.lemniscateScale as number }),
});
export const run = tool.execute;
export default tool;

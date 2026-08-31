import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{ readonly secchiDepthM: number }>;
export type Output = Readonly<{ readonly carlsonTrophicStateIndex: number }>;
const inputFields = [
  { id: "secchiDepthM", label: "Secchi depth m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.secchiDepthM, "secchiDepthM");
  return {
    carlsonTrophicStateIndex: 60 - 14.41 * Math.log(input.secchiDepthM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { secchiDepthM: 1 } satisfies Input;
export const exampleOutput = { carlsonTrophicStateIndex: 60 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/tsi-carlson-secchi",
  title: "TSI Carlson Secchi Calculator",
  description:
    "Apply Carlson Secchi TSI using observed meters; empirical clarity index may be confounded by nonalgal turbidity.",
  inputs: inputFields,
  outputs: [
    {
      id: "carlsonTrophicStateIndex",
      label: "Carlson trophic state index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ secchiDepthM: value.secchiDepthM as number }),
});
export const run = tool.execute;
export default tool;

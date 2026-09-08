import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick, toothMap } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyIdentifiedUniversalTooth: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyIdentifiedUniversalTooth",
    label: "Independently identified universal tooth",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const inverse = Object.fromEntries(
    Object.entries(toothMap).map(([a, b]) => [b, a]),
  );
  return {
    fdiTooth: pick(
      input.independentlyIdentifiedUniversalTooth,
      inverse,
      "Universal",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyIdentifiedUniversalTooth: "8" },
  output: { result: { fdiTooth: "11" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/tooth-numbering-universal-to-fdi",
  title: "Universal to FDI Numbering Converter",
  description:
    "Convert standard USUniversal1\u201332/A\u2013Tto FDI permanent/primary. Exact upper-case primary labels required; actual anatomy external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

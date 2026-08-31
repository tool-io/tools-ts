import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedTdsMgLiter: number;
  readonly matchedMeanLakeDepthM: number;
}>;
export type Output = Readonly<{
  readonly tdsConventionMorphoedaphicIndexMgLiterPerM: number;
}>;
const inputFields = [
  { id: "observedTdsMgLiter", label: "Observed tds mg liter", kind: "number" },
  {
    id: "matchedMeanLakeDepthM",
    label: "Matched mean lake depth m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.matchedMeanLakeDepthM, "matchedMeanLakeDepthM");
  nonnegative(input.observedTdsMgLiter, "observedTdsMgLiter");
  return {
    tdsConventionMorphoedaphicIndexMgLiterPerM:
      input.observedTdsMgLiter / input.matchedMeanLakeDepthM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTdsMgLiter: 100,
  matchedMeanLakeDepthM: 10,
} satisfies Input;
export const exampleOutput = {
  tdsConventionMorphoedaphicIndexMgLiterPerM: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/morphoedaphic-index-mei",
  title: "Morphoedaphic Index MEI Calculator",
  description:
    "Compute explicit TDS/mean-depth morphoedaphic index convention; not conductivity-based MEI, fish-yield prediction or universal productivity calibration.",
  inputs: inputFields,
  outputs: [
    {
      id: "tdsConventionMorphoedaphicIndexMgLiterPerM",
      label: "Tds convention morphoedaphic index mg liter per m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTdsMgLiter: value.observedTdsMgLiter as number,
      matchedMeanLakeDepthM: value.matchedMeanLakeDepthM as number,
    }),
});
export const run = tool.execute;
export default tool;

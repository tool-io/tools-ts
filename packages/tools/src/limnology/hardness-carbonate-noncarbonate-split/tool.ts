import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly totalHardnessMgLiterAsCaCo3: number;
  readonly alkalinityMgLiterAsCaCo3: number;
}>;
export type Output = Readonly<{
  readonly carbonateHardnessMgLiterAsCaCo3: number;
  readonly noncarbonateHardnessMgLiterAsCaCo3: number;
  readonly alkalinityBeyondHardnessMgLiterAsCaCo3: number;
}>;
const inputFields = [
  {
    id: "totalHardnessMgLiterAsCaCo3",
    label: "Total hardness mg liter as ca co3",
    kind: "number",
  },
  {
    id: "alkalinityMgLiterAsCaCo3",
    label: "Alkalinity mg liter as ca co3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.totalHardnessMgLiterAsCaCo3, "totalHardnessMgLiterAsCaCo3");
  nonnegative(input.alkalinityMgLiterAsCaCo3, "alkalinityMgLiterAsCaCo3");
  const carbonate = Math.min(
    input.totalHardnessMgLiterAsCaCo3,
    input.alkalinityMgLiterAsCaCo3,
  );
  return {
    carbonateHardnessMgLiterAsCaCo3: carbonate,
    noncarbonateHardnessMgLiterAsCaCo3:
      input.totalHardnessMgLiterAsCaCo3 - carbonate,
    alkalinityBeyondHardnessMgLiterAsCaCo3: Math.max(
      0,
      input.alkalinityMgLiterAsCaCo3 - input.totalHardnessMgLiterAsCaCo3,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  totalHardnessMgLiterAsCaCo3: 100,
  alkalinityMgLiterAsCaCo3: 150,
} satisfies Input;
export const exampleOutput = {
  carbonateHardnessMgLiterAsCaCo3: 100,
  noncarbonateHardnessMgLiterAsCaCo3: 0,
  alkalinityBeyondHardnessMgLiterAsCaCo3: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/hardness-carbonate-noncarbonate-split",
  title: "Hardness Carbonate Noncarbonate Split Calculator",
  description:
    "Split actual hardness by matched alkalinity expressed as CaCO3 equivalents; no treating alkalinity as calcium concentration, individual ion speciation or titration analysis.",
  inputs: inputFields,
  outputs: [
    {
      id: "carbonateHardnessMgLiterAsCaCo3",
      label: "Carbonate hardness mg liter as ca co3",
      kind: "number",
    },
    {
      id: "noncarbonateHardnessMgLiterAsCaCo3",
      label: "Noncarbonate hardness mg liter as ca co3",
      kind: "number",
    },
    {
      id: "alkalinityBeyondHardnessMgLiterAsCaCo3",
      label: "Alkalinity beyond hardness mg liter as ca co3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      totalHardnessMgLiterAsCaCo3: value.totalHardnessMgLiterAsCaCo3 as number,
      alkalinityMgLiterAsCaCo3: value.alkalinityMgLiterAsCaCo3 as number,
    }),
});
export const run = tool.execute;
export default tool;

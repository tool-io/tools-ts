import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredPh: number;
  readonly actualAlkalinityMgPerLiterAsCaco3: number;
  readonly actualCalciumHardnessMgPerLiterAsCaco3: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualMeasuredPh", label: "Actual measured ph", kind: "number" },
  {
    id: "actualAlkalinityMgPerLiterAsCaco3",
    label: "Actual alkalinity mg per liter as caco3",
    kind: "number",
  },
  {
    id: "actualCalciumHardnessMgPerLiterAsCaco3",
    label: "Actual calcium hardness mg per liter as caco3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.actualAlkalinityMgPerLiterAsCaco3,
    "actualAlkalinityMgPerLiterAsCaco3",
  );
  positive(
    input.actualCalciumHardnessMgPerLiterAsCaco3,
    "actualCalciumHardnessMgPerLiterAsCaco3",
  );
  return {
    value:
      input.actualMeasuredPh +
      Math.log10(
        input.actualAlkalinityMgPerLiterAsCaco3 *
          input.actualCalciumHardnessMgPerLiterAsCaco3,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMeasuredPh: 8,
    actualAlkalinityMgPerLiterAsCaco3: 10,
    actualCalciumHardnessMgPerLiterAsCaco3: 10,
  },
  output: { result: { value: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/aggressive-index",
  title: "Plumbing Aggressive Index Calculator",
  description:
    "Declared AWWAC400aggressive index AI=pH+log10(AH), Aalkalinity/Hcalciumhardnessmg/L asCaCO3. Not Langelier SAT index, conductivity or corrodes-any-material verdict. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

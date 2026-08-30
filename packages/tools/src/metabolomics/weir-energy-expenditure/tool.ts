import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly oxygenLitersPerMinute: number;
  readonly carbonDioxideLitersPerMinute: number;
}>;
export type Output = Readonly<{
  readonly kcalPerMinute: number;
  readonly kcalPerHour: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.oxygenLitersPerMinute < 0 || input.carbonDioxideLitersPerMinute < 0)
    simpleError("oxygenLitersPerMinute", "Gas volumes must be nonnegative.");
  const kcalPerMinute =
    3.941 * input.oxygenLitersPerMinute +
    1.106 * input.carbonDioxideLitersPerMinute;
  return { kcalPerMinute, kcalPerHour: kcalPerMinute * 60 };
};
export const exampleInput = {
  oxygenLitersPerMinute: 1,
  carbonDioxideLitersPerMinute: 1,
} satisfies Input;
export const exampleOutput = {
  kcalPerMinute: 5.047,
  kcalPerHour: 302.82,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/weir-energy-expenditure",
  title: "Weir Energy Expenditure",
  description:
    "Estimate calorimetric energy expenditure with the abbreviated Weir equation.",
  inputs: [
    {
      id: "oxygenLitersPerMinute",
      kind: "number",
      label: "Oxygen liters per minute",
    },
    {
      id: "carbonDioxideLitersPerMinute",
      kind: "number",
      label: "Carbon dioxide liters per minute",
    },
  ],
  outputs: [
    { id: "kcalPerMinute", kind: "number", label: "Kcal per minute" },
    { id: "kcalPerHour", kind: "number", label: "Kcal per hour" },
  ],
  calculate: (value) =>
    calculate({
      oxygenLitersPerMinute: value.oxygenLitersPerMinute as number,
      carbonDioxideLitersPerMinute:
        value.carbonDioxideLitersPerMinute as number,
    }),
});
export const run = tool.execute;
export default tool;

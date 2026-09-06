import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  roundMinor,
  positiveCounts,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly historicalPriceMinor: number;
  readonly historicalIndexInteger: number;
  readonly currentIndexInteger: number;
}>;
export type Output = Readonly<{ readonly adjustedPriceMinor: number }>;
const inputFields = [
  {
    id: "historicalPriceMinor",
    label: "Historical price minor",
    kind: "number",
  },
  {
    id: "historicalIndexInteger",
    label: "Historical index integer",
    kind: "number",
  },
  { id: "currentIndexInteger", label: "Current index integer", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.historicalPriceMinor, "price");
  positiveCounts([input.historicalIndexInteger, input.currentIndexInteger]);
  return {
    adjustedPriceMinor: roundMinor(
      BigInt(input.historicalPriceMinor) * BigInt(input.currentIndexInteger),
      BigInt(input.historicalIndexInteger),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  historicalPriceMinor: 10001,
  historicalIndexInteger: 100,
  currentIndexInteger: 150,
} satisfies Input;
export const exampleOutput = { adjustedPriceMinor: 15002 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/inflation-adjusted-price-converter",
  title: "Inflation Adjusted Historical Stamp Price Converter",
  description:
    "Rescale historical price by explicit positive integer same-series inflation indices with exact rational rounding. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "adjustedPriceMinor", label: "Adjusted price minor", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      historicalPriceMinor: value.historicalPriceMinor as number,
      historicalIndexInteger: value.historicalIndexInteger as number,
      currentIndexInteger: value.currentIndexInteger as number,
    }),
});
export const run = tool.execute;
export default tool;

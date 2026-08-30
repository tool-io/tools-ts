import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  bands,
} from "../shared.js";
export type Input = Readonly<{
  readonly callerPriceBandLowerMassesCarats: readonly number[];
  readonly callerBandRatesPerCarat: readonly number[];
  readonly beforeMassCarats: number;
  readonly afterMassCarats: number;
}>;
export type Output = Readonly<{
  readonly beforeBandIndex: number;
  readonly afterBandIndex: number;
  readonly quotedRateJumpPerCarat: number;
  readonly quotedTotalPriceChange: number;
}>;
const inputFields = [
  {
    id: "callerPriceBandLowerMassesCarats",
    label: "Caller price band lower masses carats",
    kind: "numberList",
  },
  {
    id: "callerBandRatesPerCarat",
    label: "Caller band rates per carat",
    kind: "numberList",
  },
  { id: "beforeMassCarats", label: "Before mass carats", kind: "number" },
  { id: "afterMassCarats", label: "After mass carats", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.beforeMassCarats, "beforeMassCarats");
  positive(input.afterMassCarats, "afterMassCarats");
  input.callerPriceBandLowerMassesCarats.forEach((v) =>
    nonnegative(v, "callerPriceBandLowerMassesCarats"),
  );
  input.callerBandRatesPerCarat.forEach((v) =>
    nonnegative(v, "callerBandRatesPerCarat"),
  );
  aligned(
    input.callerPriceBandLowerMassesCarats,
    input.callerBandRatesPerCarat,
    "callerPriceBandLowerMassesCarats",
  );
  const beforeBandIndex = bands(
      input.callerPriceBandLowerMassesCarats,
      input.beforeMassCarats,
    ),
    afterBandIndex = bands(
      input.callerPriceBandLowerMassesCarats,
      input.afterMassCarats,
    );
  return {
    beforeBandIndex,
    afterBandIndex,
    quotedRateJumpPerCarat:
      input.callerBandRatesPerCarat[afterBandIndex] -
      input.callerBandRatesPerCarat[beforeBandIndex],
    quotedTotalPriceChange:
      input.afterMassCarats * input.callerBandRatesPerCarat[afterBandIndex] -
      input.beforeMassCarats * input.callerBandRatesPerCarat[beforeBandIndex],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPriceBandLowerMassesCarats: [0, 1, 2],
  callerBandRatesPerCarat: [50, 100, 200],
  beforeMassCarats: 0.99,
  afterMassCarats: 1.01,
} satisfies Input;
export const exampleOutput = {
  beforeBandIndex: 0,
  afterBandIndex: 1,
  quotedRateJumpPerCarat: 50,
  quotedTotalPriceChange: 51.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/magic-size-price-jump",
  title: "Price Jump at Magic Size Checker",
  description:
    "Audit actual supplied discrete size-band quotation jump across two measured masses, preserving signed changes rather than interpolate across a discontinuity; no universal magic-size pricing.",
  inputs: inputFields,
  outputs: [
    { id: "beforeBandIndex", label: "Before band index", kind: "number" },
    { id: "afterBandIndex", label: "After band index", kind: "number" },
    {
      id: "quotedRateJumpPerCarat",
      label: "Quoted rate jump per carat",
      kind: "number",
    },
    {
      id: "quotedTotalPriceChange",
      label: "Quoted total price change",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerPriceBandLowerMassesCarats:
        value.callerPriceBandLowerMassesCarats as readonly number[],
      callerBandRatesPerCarat:
        value.callerBandRatesPerCarat as readonly number[],
      beforeMassCarats: value.beforeMassCarats as number,
      afterMassCarats: value.afterMassCarats as number,
    }),
});
export const run = tool.execute;
export default tool;

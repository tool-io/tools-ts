import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  money,
  signedSum,
  roundMinor,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerSpotQuoteMinor: number;
  readonly callerProcessQuoteMinor: number;
}>;
export type Output = Readonly<{
  readonly signedSpotCostPremiumMinor: number;
  readonly spotOverProcessCostBasisPoints: number;
}>;
const inputFields = [
  {
    id: "callerSpotQuoteMinor",
    label: "Caller spot quote minor",
    kind: "number",
  },
  {
    id: "callerProcessQuoteMinor",
    label: "Caller process quote minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.callerSpotQuoteMinor, "spot quote");
  money(input.callerProcessQuoteMinor, "process quote");
  positive(input.callerProcessQuoteMinor, "process comparison quote");
  return {
    signedSpotCostPremiumMinor: signedSum([
      input.callerSpotQuoteMinor,
      -input.callerProcessQuoteMinor,
    ]),
    spotOverProcessCostBasisPoints: roundMinor(
      BigInt(input.callerSpotQuoteMinor) * 10000n,
      BigInt(input.callerProcessQuoteMinor),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSpotQuoteMinor: 120,
  callerProcessQuoteMinor: 100,
} satisfies Input;
export const exampleOutput = {
  signedSpotCostPremiumMinor: 20,
  spotOverProcessCostBasisPoints: 12000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/spot-vs-process-cost-factor-lookup",
  title: "Spot vs Process Cost Factor Lookup",
  description:
    "Same job/currency actual spot vs process print quote contrast, exact safe minor units; no universal plate/run cost multiplier. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedSpotCostPremiumMinor",
      label: "Signed spot cost premium minor",
      kind: "number",
    },
    {
      id: "spotOverProcessCostBasisPoints",
      label: "Spot over process cost basis points",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSpotQuoteMinor: value.callerSpotQuoteMinor as number,
      callerProcessQuoteMinor: value.callerProcessQuoteMinor as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly spotQuote: number;
  readonly forwardPoints: number;
  readonly callerQuoteUnitsPerPoint: number;
  readonly tenorDays: number;
  readonly callerAnnualDayBasis: number;
}>;
export type Output = Readonly<{
  readonly outrightForwardQuote: number;
  readonly signedAnnualizedForwardPremiumPercent: number;
}>;
const inputFields = [
  { id: "spotQuote", label: "Spot quote", kind: "number" },
  { id: "forwardPoints", label: "Forward points", kind: "number" },
  {
    id: "callerQuoteUnitsPerPoint",
    label: "Caller quote units per point",
    kind: "number",
  },
  { id: "tenorDays", label: "Tenor days", kind: "number" },
  {
    id: "callerAnnualDayBasis",
    label: "Caller annual day basis",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.spotQuote, "spotQuote");
  positive(input.callerQuoteUnitsPerPoint, "callerQuoteUnitsPerPoint");
  bounded(input.tenorDays, "tenor", 1, 3660);
  bounded(input.callerAnnualDayBasis, "basis", 1, 366);
  const forward = positive(
    input.spotQuote + input.forwardPoints * input.callerQuoteUnitsPerPoint,
    "forwardQuote",
  );
  return {
    outrightForwardQuote: forward,
    signedAnnualizedForwardPremiumPercent:
      100 *
      ((input.forwardPoints * input.callerQuoteUnitsPerPoint) /
        input.spotQuote) *
      (input.callerAnnualDayBasis / input.tenorDays),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  spotQuote: 1.2,
  forwardPoints: 10,
  callerQuoteUnitsPerPoint: 0.0001,
  tenorDays: 90,
  callerAnnualDayBasis: 360,
} satisfies Input;
export const exampleOutput = {
  outrightForwardQuote: 1.201,
  signedAnnualizedForwardPremiumPercent: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/forward-points-annualized-premium",
  title: "Forward Points Annualized Premium Calculator",
  description:
    "Decode signed quoted forward points at explicit caller point scale and annual day basis; positive/negative premium is quote-direction dependent, not an investment return or covered-interest-arbitrage assurance.",
  inputs: inputFields,
  outputs: [
    {
      id: "outrightForwardQuote",
      label: "Outright forward quote",
      kind: "number",
    },
    {
      id: "signedAnnualizedForwardPremiumPercent",
      label: "Signed annualized forward premium percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      spotQuote: value.spotQuote as number,
      forwardPoints: value.forwardPoints as number,
      callerQuoteUnitsPerPoint: value.callerQuoteUnitsPerPoint as number,
      tenorDays: value.tenorDays as number,
      callerAnnualDayBasis: value.callerAnnualDayBasis as number,
    }),
});
export const run = tool.execute;
export default tool;

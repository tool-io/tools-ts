import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  bounded,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly existingShares: number;
  readonly dividendShares: number;
  readonly fairValuePerShareMinor: number;
  readonly parValuePerShareMinor: number;
  readonly availableRetainedEarningsMinor: number;
  readonly callerSmallDividendUpperBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly dividendSizeBasisPoints: number;
  readonly withinCallerSmallDividendPolicy: boolean;
  readonly requiredRetainedEarningsTransferMinor: number;
  readonly shareCapitalIncreaseMinor: number;
  readonly apicIncreaseMinor: number;
  readonly signedRetainedEarningsMarginMinor: number;
  readonly retainedEarningsCoversTransfer: boolean;
}>;
const inputFields = [
  { id: "existingShares", label: "Existing shares", kind: "number" },
  { id: "dividendShares", label: "Dividend shares", kind: "number" },
  {
    id: "fairValuePerShareMinor",
    label: "Fair value per share minor",
    kind: "number",
  },
  {
    id: "parValuePerShareMinor",
    label: "Par value per share minor",
    kind: "number",
  },
  {
    id: "availableRetainedEarningsMinor",
    label: "Available retained earnings minor",
    kind: "number",
  },
  {
    id: "callerSmallDividendUpperBasisPoints",
    label: "Caller small dividend upper basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.fairValuePerShareMinor, "fairValuePerShareMinor");
  money(input.parValuePerShareMinor, "parValuePerShareMinor");
  money(input.availableRetainedEarningsMinor, "availableRetainedEarningsMinor");
  bounded(input.existingShares, "shares", 1, 1000000000);
  bounded(input.dividendShares, "dividend", 0, 1000000000);
  bounded(input.callerSmallDividendUpperBasisPoints, "policy", 0, 10000);
  if (input.parValuePerShareMinor > input.fairValuePerShareMinor)
    simpleError(
      "valuation",
      "Caller small-stock-dividend fair value must be at least par for this allocation.",
    );
  const required = money(
      input.dividendShares * input.fairValuePerShareMinor,
      "transfer",
    ),
    capital = money(
      input.dividendShares * input.parValuePerShareMinor,
      "capital",
    ),
    margin = integer(input.availableRetainedEarningsMinor - required, "margin");
  return {
    dividendSizeBasisPoints:
      (10000 * input.dividendShares) / input.existingShares,
    withinCallerSmallDividendPolicy:
      BigInt(input.dividendShares) * 10000n <=
      BigInt(input.existingShares) *
        BigInt(input.callerSmallDividendUpperBasisPoints),
    requiredRetainedEarningsTransferMinor: required,
    shareCapitalIncreaseMinor: capital,
    apicIncreaseMinor: required - capital,
    signedRetainedEarningsMarginMinor: margin,
    retainedEarningsCoversTransfer: margin >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  existingShares: 1000,
  dividendShares: 100,
  fairValuePerShareMinor: 20,
  parValuePerShareMinor: 5,
  availableRetainedEarningsMinor: 1500,
  callerSmallDividendUpperBasisPoints: 2000,
} satisfies Input;
export const exampleOutput = {
  dividendSizeBasisPoints: 1000,
  withinCallerSmallDividendPolicy: true,
  requiredRetainedEarningsTransferMinor: 2000,
  shareCapitalIncreaseMinor: 500,
  apicIncreaseMinor: 1500,
  signedRetainedEarningsMarginMinor: -500,
  retainedEarningsCoversTransfer: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/small-stock-dividend-retained-earnings-cap",
  title: "Small Stock Dividend Retained Earnings Cap Checker",
  description:
    "Audit caller small-stock-dividend size policy and fair-value retained-earnings transfer split into par/APIC, exposing funding deficit without silently capping distribution; applicable accounting framework and authorization remain external.",
  inputs: inputFields,
  outputs: [
    {
      id: "dividendSizeBasisPoints",
      label: "Dividend size basis points",
      kind: "number",
    },
    {
      id: "withinCallerSmallDividendPolicy",
      label: "Within caller small dividend policy",
      kind: "boolean",
    },
    {
      id: "requiredRetainedEarningsTransferMinor",
      label: "Required retained earnings transfer minor",
      kind: "number",
    },
    {
      id: "shareCapitalIncreaseMinor",
      label: "Share capital increase minor",
      kind: "number",
    },
    { id: "apicIncreaseMinor", label: "Apic increase minor", kind: "number" },
    {
      id: "signedRetainedEarningsMarginMinor",
      label: "Signed retained earnings margin minor",
      kind: "number",
    },
    {
      id: "retainedEarningsCoversTransfer",
      label: "Retained earnings covers transfer",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      existingShares: value.existingShares as number,
      dividendShares: value.dividendShares as number,
      fairValuePerShareMinor: value.fairValuePerShareMinor as number,
      parValuePerShareMinor: value.parValuePerShareMinor as number,
      availableRetainedEarningsMinor:
        value.availableRetainedEarningsMinor as number,
      callerSmallDividendUpperBasisPoints:
        value.callerSmallDividendUpperBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const harrisonEntries = {
  act: {
    keyDate: "1714",
    statement:
      "Royal Museums Greenwich states that the Longitude Act offered rewards for solving precise longitude at sea and set the three-seconds-per-day target Harrison pursued.",
  },
  barbadosTrial: {
    keyDate: "1764–1765",
    statement:
      "Harrison sailed with H4 in March 1764 and reached Barbados in May; the Board considered the result in February 1765.",
  },
  completion: {
    keyDate: "1759",
    statement:
      "Royal Museums Greenwich identifies H4 as John Harrison's prize-winning longitude watch, completed in 1759 after work began in 1755.",
  },
  paymentDispute: {
    keyDate: "1765 onward",
    statement:
      "The Board recommended a £10,000 payment in 1765; Harrison sought the full reward, and disputes over further tests and payment continued afterward.",
  },
  royalObservatoryTest: {
    keyDate: "1766",
    statement:
      "RMG records that the Board delivered H4 to Nevil Maskelyne at the Royal Observatory, Greenwich, for further testing on 5 May 1766.",
  },
} as const;

export type HarrisonHistoryFocus = keyof typeof harrisonEntries;

export type HarrisonHistoryLookupInput = {
  readonly historyFocus: HarrisonHistoryFocus;
};

export type HarrisonHistoryLookupOutput = {
  readonly historyFocus: HarrisonHistoryFocus;
  readonly keyDate: string;
  readonly verifiedStatement: string;
};

export const lookupJohnHarrisonH4History = (
  input: HarrisonHistoryLookupInput,
): HarrisonHistoryLookupOutput => {
  const entry = harrisonEntries[input.historyFocus];
  if (entry === undefined)
    simpleError(
      "historyFocus",
      "John Harrison H4 history focus is not supported.",
      "unsupported_history_focus",
    );
  return {
    historyFocus: input.historyFocus,
    keyDate: entry.keyDate,
    verifiedStatement: entry.statement,
  };
};

export const harrisonH4Example = {
  input: { historyFocus: "completion" },
  output: {
    historyFocus: "completion",
    keyDate: "1759",
    verifiedStatement:
      "Royal Museums Greenwich identifies H4 as John Harrison's prize-winning longitude watch, completed in 1759 after work began in 1755.",
  },
} satisfies ToolExample<
  HarrisonHistoryLookupInput,
  HarrisonHistoryLookupOutput
>;

export const harrisonH4Tool = createSimpleTool({
  calculate: (input) =>
    lookupJohnHarrisonH4History({
      historyFocus: input.historyFocus as HarrisonHistoryFocus,
    }),
  description:
    "Return a Royal Museums Greenwich fact about the 1714 Longitude Act, H4's completion, Barbados trial, 1765 payment dispute, or 1766 Royal Observatory test.",
  id: "horology/john-harrison-h4-longitude-history-lookup",
  inputs: [
    {
      enum: [
        "act",
        "completion",
        "barbadosTrial",
        "paymentDispute",
        "royalObservatoryTest",
      ],
      id: "historyFocus",
      kind: "string",
      label: "John Harrison H4 history focus",
    },
  ],
  outputs: [
    {
      id: "historyFocus",
      kind: "string",
      label: "John Harrison H4 history focus",
    },
    { id: "keyDate", kind: "string", label: "Key date" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified H4 history statement",
    },
  ],
  title: "John Harrison H4 Longitude History Lookup",
});

export const runHarrisonH4 = harrisonH4Tool.execute;
export default harrisonH4Tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const historyEntries = {
  construction: {
    keyDate: "1973",
    statement:
      "NATO's official history describes a long nylon strap with additional length and two spring bars so it could be worn over a uniform, with chrome-plated brass hardware.",
  },
  creation: {
    keyDate: "1973",
    statement:
      "NATO's official history states that the British Ministry of Defence created the strap in 1973 for military practicality.",
  },
  g10Nickname: {
    keyDate: "1973",
    statement:
      "NATO records the G-10 nickname as referring to the G-1098 form used by British Special Forces when issued the strap.",
  },
  name: {
    keyDate: "later colloquial name",
    statement:
      "The name NATO arose because allied militaries used NATO Stock Numbers for standardized supplies; the original British strap was not a NATO-branded product.",
  },
  originalSpecification: {
    keyDate: "initial issue",
    statement:
      "NATO describes the original one-version strap as admiralty grey, nylon, and 20 millimetres wide.",
  },
  variants: {
    keyDate: "after initial issue",
    statement:
      "Regimental stripe variants appeared after the initial British Special Forces rollout, while modern NATO-style straps include many non-military designs.",
  },
} as const;

export type NatoStrapHistoryFocus = keyof typeof historyEntries;

export type NatoStrapHistoryLookupInput = {
  readonly historyFocus: NatoStrapHistoryFocus;
};

export type NatoStrapHistoryLookupOutput = {
  readonly historyFocus: NatoStrapHistoryFocus;
  readonly keyDate: string;
  readonly verifiedStatement: string;
};

export const lookupNatoStrapHistory = (
  input: NatoStrapHistoryLookupInput,
): NatoStrapHistoryLookupOutput => {
  const entry = historyEntries[input.historyFocus];
  if (entry === undefined)
    simpleError(
      "historyFocus",
      "NATO strap history focus is not supported.",
      "unsupported_history_focus",
    );
  return {
    historyFocus: input.historyFocus,
    keyDate: entry.keyDate,
    verifiedStatement: entry.statement,
  };
};

export const natoStrapHistoryExample = {
  input: { historyFocus: "creation" },
  output: {
    historyFocus: "creation",
    keyDate: "1973",
    verifiedStatement:
      "NATO's official history states that the British Ministry of Defence created the strap in 1973 for military practicality.",
  },
} satisfies ToolExample<
  NatoStrapHistoryLookupInput,
  NatoStrapHistoryLookupOutput
>;

export const natoStrapHistoryTool = createSimpleTool({
  calculate: (input) =>
    lookupNatoStrapHistory({
      historyFocus: input.historyFocus as NatoStrapHistoryFocus,
    }),
  description:
    "Return NATO's official history of the 1973 British MoD strap, its G-10 nickname, original construction, naming, and later variants.",
  id: "horology/nato-strap-british-mod-history-lookup",
  inputs: [
    {
      enum: [
        "creation",
        "originalSpecification",
        "construction",
        "g10Nickname",
        "name",
        "variants",
      ],
      id: "historyFocus",
      kind: "string",
      label: "NATO strap history focus",
    },
  ],
  outputs: [
    { id: "historyFocus", kind: "string", label: "NATO strap history focus" },
    { id: "keyDate", kind: "string", label: "Key date or period" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified NATO strap statement",
    },
  ],
  title: "NATO Strap British MoD History Lookup",
});

export const runNatoStrapHistory = natoStrapHistoryTool.execute;
export default natoStrapHistoryTool;

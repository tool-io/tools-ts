import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const ruleEntries = {
  completeWatch: {
    keyDate: "revised ordinance, 1 January 2017",
    statement:
      "The revised Swiss Made rule requires at least 60 percent of complete-watch manufacturing cost to be generated in Switzerland; casing and crystal could be excluded only under the transitional provision ending 31 December 2018.",
  },
  development: {
    keyDate: "revised ordinance",
    statement:
      "Technical development of both the Swiss Made watch and the Swiss Made movement must take place in Switzerland.",
  },
  fiftyOnePercent: {
    keyDate: "not the published rule",
    statement:
      "A universal 51 percent threshold is not the published Swiss Made rule: the relevant movement rules use 50 percent of component value and 60 percent of manufacturing cost.",
  },
  movementComponents: {
    keyDate: "revised ordinance",
    statement:
      "Swiss-made components must represent at least half of the movement's component value.",
  },
  movementCost: {
    keyDate: "revised ordinance",
    statement:
      "At least 60 percent of the manufacturing cost of a Swiss Made movement must be generated in Switzerland.",
  },
  transition: {
    keyDate: "1 January 2017–31 December 2018",
    statement:
      "The complete-watch rule entered into force on 1 January 2017, with temporary exclusion of casing and crystal for qualifying stock through 31 December 2018.",
  },
} as const;

export type SwissMadeRuleFocus = keyof typeof ruleEntries;

export type SwissMadeRuleLookupInput = {
  readonly ruleFocus: SwissMadeRuleFocus;
};

export type SwissMadeRuleLookupOutput = {
  readonly keyDate: string;
  readonly ruleFocus: SwissMadeRuleFocus;
  readonly verifiedRule: string;
};

export const lookupSwissMadeCostRuleHistory = (
  input: SwissMadeRuleLookupInput,
): SwissMadeRuleLookupOutput => {
  const entry = ruleEntries[input.ruleFocus];
  if (entry === undefined)
    simpleError(
      "ruleFocus",
      "Swiss Made rule focus is not supported.",
      "unsupported_rule_focus",
    );
  return {
    keyDate: entry.keyDate,
    ruleFocus: input.ruleFocus,
    verifiedRule: entry.statement,
  };
};

export const swissMadeRuleExample = {
  input: { ruleFocus: "completeWatch" },
  output: {
    keyDate: "revised ordinance, 1 January 2017",
    ruleFocus: "completeWatch",
    verifiedRule:
      "The revised Swiss Made rule requires at least 60 percent of complete-watch manufacturing cost to be generated in Switzerland; casing and crystal could be excluded only under the transitional provision ending 31 December 2018.",
  },
} satisfies ToolExample<SwissMadeRuleLookupInput, SwissMadeRuleLookupOutput>;

export const swissMadeRuleTool = createSimpleTool({
  calculate: (input) =>
    lookupSwissMadeCostRuleHistory({
      ruleFocus: input.ruleFocus as SwissMadeRuleFocus,
    }),
  description:
    "Return the published Swiss Made complete-watch, movement-value, movement-cost, development, transition, or 51-percent correction rule.",
  id: "horology/swiss-made-cost-rule-history-lookup",
  inputs: [
    {
      enum: [
        "completeWatch",
        "movementComponents",
        "movementCost",
        "development",
        "transition",
        "fiftyOnePercent",
      ],
      id: "ruleFocus",
      kind: "string",
      label: "Swiss Made cost-rule focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Effective date or rule status" },
    { id: "ruleFocus", kind: "string", label: "Swiss Made cost-rule focus" },
    { id: "verifiedRule", kind: "string", label: "Published Swiss Made rule" },
  ],
  title: "Swiss Made Cost Rule History Lookup",
});

export const runSwissMadeRule = swissMadeRuleTool.execute;
export default swissMadeRuleTool;

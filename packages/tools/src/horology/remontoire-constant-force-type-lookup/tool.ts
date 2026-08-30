import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const remontoireEntries = {
  electric: {
    keyDate: "modern classification",
    statement:
      "An electric remontoire is rewound by a motor or other electromechanical drive and can itself use gravity or spring energy for the timekeeping mechanism.",
  },
  escapementLocation: {
    keyDate: "train-location taxonomy",
    statement:
      "An escapement remontoire applies its secondary power directly to the escape wheel or escapement; a train remontoire feeds an upstream wheel in the train.",
  },
  gravity: {
    keyDate: "precision-clock type",
    statement:
      "A gravity remontoire uses the force of a descending weight as its secondary power source and is associated principally with precision clocks.",
  },
  purpose: {
    keyDate: "constant-force objective",
    statement:
      "A remontoire periodically stores energy in a secondary weight or spring so the escapement is driven from that source while the main source rewinds it.",
  },
  spring: {
    keyDate: "portable-watch type",
    statement:
      "A spring remontoire uses a secondary spring as its portable power reserve; unlike a weight, it is not fundamentally dependent on gravity remaining vertical.",
  },
  watchConstraint: {
    keyDate: "wearability",
    statement:
      "A gravity remontoire is not generally portable because wearer motion disturbs the weight's driving force, while a spring remontoire can be used in a watch.",
  },
} as const;

export type RemontoireFocus = keyof typeof remontoireEntries;

export type RemontoireLookupInput = {
  readonly remontoireFocus: RemontoireFocus;
};

export type RemontoireLookupOutput = {
  readonly keyDate: string;
  readonly remontoireFocus: RemontoireFocus;
  readonly verifiedStatement: string;
};

export const lookupRemontoireConstantForceType = (
  input: RemontoireLookupInput,
): RemontoireLookupOutput => {
  const entry = remontoireEntries[input.remontoireFocus];
  if (entry === undefined)
    simpleError(
      "remontoireFocus",
      "Remontoire focus is not supported.",
      "unsupported_remontoire_focus",
    );
  return {
    keyDate: entry.keyDate,
    remontoireFocus: input.remontoireFocus,
    verifiedStatement: entry.statement,
  };
};

export const remontoireExample = {
  input: { remontoireFocus: "purpose" },
  output: {
    keyDate: "constant-force objective",
    remontoireFocus: "purpose",
    verifiedStatement:
      "A remontoire periodically stores energy in a secondary weight or spring so the escapement is driven from that source while the main source rewinds it.",
  },
} satisfies ToolExample<RemontoireLookupInput, RemontoireLookupOutput>;

export const remontoireTool = createSimpleTool({
  calculate: (input) =>
    lookupRemontoireConstantForceType({
      remontoireFocus: input.remontoireFocus as RemontoireFocus,
    }),
  description:
    "Return the purpose, spring, gravity, electric, escapement-location, train-location, or watch-use classification of a constant-force remontoire.",
  id: "horology/remontoire-constant-force-type-lookup",
  inputs: [
    {
      enum: [
        "purpose",
        "spring",
        "gravity",
        "electric",
        "escapementLocation",
        "watchConstraint",
      ],
      id: "remontoireFocus",
      kind: "string",
      label: "Remontoire constant-force type focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Type context" },
    {
      id: "remontoireFocus",
      kind: "string",
      label: "Remontoire constant-force type focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified remontoire statement",
    },
  ],
  title: "Remontoire Constant Force Type Lookup",
});

export const runRemontoire = remontoireTool.execute;
export default remontoireTool;

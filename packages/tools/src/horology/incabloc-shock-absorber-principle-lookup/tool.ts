import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const incablocEntries = {
  conicalConstruction: {
    keyDate: "1933",
    statement:
      "Incabloc's history dates its conical construction and the beginning of Incabloc production to 1933.",
  },
  doubleCone: {
    keyDate: "current double-cone system",
    statement:
      "Incabloc states that its double-cone director recenters the endstone and bushing while constraining travel perpendicular to the balance staff.",
  },
  history: {
    keyDate: "1928–1938",
    statement:
      "Incabloc traces research on movable balance-jewel protection to 1928, a first patent to 1929, conical production to 1933, and the lyre-spring design to 1938.",
  },
  limitation: {
    keyDate: "service-specific",
    statement:
      "Shock-absorber height, jewel geometry, balance staff, and setting must be matched to the movement; the Incabloc name alone is not a cross-brand compatibility specification.",
  },
  lyreSpring: {
    keyDate: "1938",
    statement:
      "Incabloc describes the lyre spring as positioning and returning the bearing block while a double cone directs the shock path.",
  },
  shockCycle: {
    keyDate: "shock event",
    statement:
      "Incabloc describes a two-phase response: the balance staff transfers energy to the bearing block, and the spring returns the bearing to center.",
  },
} as const;

export type IncablocPrincipleFocus = keyof typeof incablocEntries;

export type IncablocPrincipleLookupInput = {
  readonly principleFocus: IncablocPrincipleFocus;
};

export type IncablocPrincipleLookupOutput = {
  readonly keyDate: string;
  readonly principleFocus: IncablocPrincipleFocus;
  readonly verifiedStatement: string;
};

export const lookupIncablocShockPrinciple = (
  input: IncablocPrincipleLookupInput,
): IncablocPrincipleLookupOutput => {
  const entry = incablocEntries[input.principleFocus];
  if (entry === undefined)
    simpleError(
      "principleFocus",
      "Incabloc principle focus is not supported.",
      "unsupported_principle_focus",
    );
  return {
    keyDate: entry.keyDate,
    principleFocus: input.principleFocus,
    verifiedStatement: entry.statement,
  };
};

export const incablocPrincipleExample = {
  input: { principleFocus: "doubleCone" },
  output: {
    keyDate: "current double-cone system",
    principleFocus: "doubleCone",
    verifiedStatement:
      "Incabloc states that its double-cone director recenters the endstone and bushing while constraining travel perpendicular to the balance staff.",
  },
} satisfies ToolExample<
  IncablocPrincipleLookupInput,
  IncablocPrincipleLookupOutput
>;

export const incablocPrincipleTool = createSimpleTool({
  calculate: (input) =>
    lookupIncablocShockPrinciple({
      principleFocus: input.principleFocus as IncablocPrincipleFocus,
    }),
  description:
    "Return Incabloc's documented history, cone, lyre-spring, shock-cycle, or service-compatibility principle without substituting a universal Kif or Incabloc jewel-displacement value.",
  id: "horology/incabloc-shock-absorber-principle-lookup",
  inputs: [
    {
      enum: [
        "history",
        "conicalConstruction",
        "lyreSpring",
        "doubleCone",
        "shockCycle",
        "limitation",
      ],
      id: "principleFocus",
      kind: "string",
      label: "Incabloc shock-absorber principle focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Key date or status" },
    {
      id: "principleFocus",
      kind: "string",
      label: "Incabloc shock-absorber principle focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified Incabloc statement",
    },
  ],
  title: "Incabloc Shock Absorber Principle Lookup",
});

export const runIncablocPrinciple = incablocPrincipleTool.execute;
export default incablocPrincipleTool;

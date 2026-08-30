import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const patinaEntries = {
  alloy: {
    keyDate: "material-specific",
    statement:
      "Bronze is a family of copper alloys, not one fixed composition; alloy, heat treatment, surface finish, and protective treatments affect how it changes.",
  },
  environmentalExposure: {
    keyDate: "continuous",
    statement:
      "Hamilton states that each bronze case develops an individual patina based on environmental exposure; there is no universal color sequence or age chart.",
  },
  moistureOxygen: {
    keyDate: "continuous",
    statement:
      "Bronze manufacturers describe interaction with air, moisture, and daily wear as the basis of natural surface development.",
  },
  skinContact: {
    keyDate: "wear-dependent",
    statement:
      "Contact with skin, sweat, oils, and friction varies among wearers and wear patterns, so two cases exposed for the same time can develop different surfaces.",
  },
  timelineCaution: {
    keyDate: "not standardized",
    statement:
      "A universal patina timeline is not technically defensible; photograph the case over time and use the maker's care instructions instead of promising a brown, green, or stable state by a fixed date.",
  },
} as const;

export type BronzePatinaFocus = keyof typeof patinaEntries;

export type BronzePatinaLookupInput = {
  readonly patinaFocus: BronzePatinaFocus;
};

export type BronzePatinaLookupOutput = {
  readonly keyDate: string;
  readonly patinaFocus: BronzePatinaFocus;
  readonly verifiedStatement: string;
};

export const lookupBronzePatinaFactor = (
  input: BronzePatinaLookupInput,
): BronzePatinaLookupOutput => {
  const entry = patinaEntries[input.patinaFocus];
  if (entry === undefined)
    simpleError(
      "patinaFocus",
      "Bronze patina factor focus is not supported.",
      "unsupported_patina_focus",
    );
  return {
    keyDate: entry.keyDate,
    patinaFocus: input.patinaFocus,
    verifiedStatement: entry.statement,
  };
};

export const bronzePatinaExample = {
  input: { patinaFocus: "timelineCaution" },
  output: {
    keyDate: "not standardized",
    patinaFocus: "timelineCaution",
    verifiedStatement:
      "A universal patina timeline is not technically defensible; photograph the case over time and use the maker's care instructions instead of promising a brown, green, or stable state by a fixed date.",
  },
} satisfies ToolExample<BronzePatinaLookupInput, BronzePatinaLookupOutput>;

export const bronzePatinaTool = createSimpleTool({
  calculate: (input) =>
    lookupBronzePatinaFactor({
      patinaFocus: input.patinaFocus as BronzePatinaFocus,
    }),
  description:
    "Return alloy, air, moisture, skin-contact, environmental, and no-fixed-timeline facts for bronze watch-case patina.",
  id: "horology/bronze-patina-development-factor-lookup",
  inputs: [
    {
      enum: [
        "alloy",
        "moistureOxygen",
        "skinContact",
        "environmentalExposure",
        "timelineCaution",
      ],
      id: "patinaFocus",
      kind: "string",
      label: "Bronze patina development factor focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Patina time context" },
    {
      id: "patinaFocus",
      kind: "string",
      label: "Bronze patina development factor focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified bronze-patina statement",
    },
  ],
  title: "Bronze Patina Development Factor Lookup",
});

export const runBronzePatina = bronzePatinaTool.execute;
export default bronzePatinaTool;

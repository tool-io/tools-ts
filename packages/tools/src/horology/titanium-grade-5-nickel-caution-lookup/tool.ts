import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const titaniumEntries = {
  allergyCaution: {
    keyDate: "skin-reaction scope",
    statement:
      "Absence of intentional nickel in Grade 5 does not guarantee that every wearer will tolerate a finished watch; coatings, fasteners, contamination, and individual sensitivity must be considered separately.",
  },
  gradeIdentity: {
    keyDate: "ASTM B348 Grade 5",
    statement:
      "ASTM B348 identifies Grade 5 as a titanium alloy containing approximately 6 percent aluminum and 4 percent vanadium, UNS R56400.",
  },
  nickelAddition: {
    keyDate: "Grade 25 is distinct",
    statement:
      "ASTM B348 separately defines Grade 25 as a 6Al-4V alloy with 0.3 to 0.8 percent nickel and 0.04 to 0.08 percent palladium, so a generic Grade 5 label must not be substituted for a different titanium grade.",
  },
  nickelClaim: {
    keyDate: "composition scope",
    statement:
      "Grade 5 is not defined as a nickel-bearing alloy in the cited ASTM composition, but actual case components must be identified by their own material certificates.",
  },
  releaseMeasurement: {
    keyDate: "product-specific",
    statement:
      "Nickel release is a surface and exposure property requiring a relevant test method; bulk composition alone is not a substitute for finished-product release testing.",
  },
} as const;

export type TitaniumCautionFocus = keyof typeof titaniumEntries;

export type TitaniumCautionLookupInput = {
  readonly cautionFocus: TitaniumCautionFocus;
};

export type TitaniumCautionLookupOutput = {
  readonly cautionFocus: TitaniumCautionFocus;
  readonly keyDate: string;
  readonly verifiedStatement: string;
};

export const lookupTitaniumGrade5NickelCaution = (
  input: TitaniumCautionLookupInput,
): TitaniumCautionLookupOutput => {
  const entry = titaniumEntries[input.cautionFocus];
  if (entry === undefined)
    simpleError(
      "cautionFocus",
      "Titanium caution focus is not supported.",
      "unsupported_caution_focus",
    );
  return {
    cautionFocus: input.cautionFocus,
    keyDate: entry.keyDate,
    verifiedStatement: entry.statement,
  };
};

export const titaniumCautionExample = {
  input: { cautionFocus: "gradeIdentity" },
  output: {
    cautionFocus: "gradeIdentity",
    keyDate: "ASTM B348 Grade 5",
    verifiedStatement:
      "ASTM B348 identifies Grade 5 as a titanium alloy containing approximately 6 percent aluminum and 4 percent vanadium, UNS R56400.",
  },
} satisfies ToolExample<
  TitaniumCautionLookupInput,
  TitaniumCautionLookupOutput
>;

export const titaniumCautionTool = createSimpleTool({
  calculate: (input) =>
    lookupTitaniumGrade5NickelCaution({
      cautionFocus: input.cautionFocus as TitaniumCautionFocus,
    }),
  description:
    "Return ASTM Grade 5 composition, nickel, release-testing, grade-confusion, and individual-allergy cautions without promising nickel-free tolerance.",
  id: "horology/titanium-grade-5-nickel-caution-lookup",
  inputs: [
    {
      enum: [
        "gradeIdentity",
        "nickelClaim",
        "releaseMeasurement",
        "nickelAddition",
        "allergyCaution",
      ],
      id: "cautionFocus",
      kind: "string",
      label: "Titanium Grade 5 nickel caution focus",
    },
  ],
  outputs: [
    {
      id: "cautionFocus",
      kind: "string",
      label: "Titanium Grade 5 nickel caution focus",
    },
    { id: "keyDate", kind: "string", label: "Material or test context" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified titanium statement",
    },
  ],
  title: "Titanium Grade 5 Nickel Caution Lookup",
});

export const runTitaniumCaution = titaniumCautionTool.execute;
export default titaniumCautionTool;

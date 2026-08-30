import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const patternEntries = {
  clousDeParis: {
    keyDate: "guilloché motif",
    statement:
      "Clous de Paris is a repeated pyramid-like geometric motif produced by intersecting engraved lines; it is a pattern within the guilloché family.",
  },
  execution: {
    keyDate: "process-specific",
    statement:
      "A pattern can be hand-guided on an engine-turning machine or produced by machine engraving; the motif name alone does not establish which process made a specific part.",
  },
  guilloche: {
    keyDate: "decorative technique",
    statement:
      "FHH defines guilloché as hand or machine engraving with intersecting wavy or straight lines created by relative horizontal or vertical tool movement.",
  },
  perlage: {
    keyDate: "circular-graining finish",
    statement:
      "Patek Philippe defines perlage as a repeating pattern of interlaced circles or bead shapes, commonly described as circular graining.",
  },
  relationship: {
    keyDate: "taxonomy",
    statement:
      "Guilloché describes the broader engraving technique, Clous de Paris is a guilloché motif, and perlage is a separate circular surface finish rather than a synonym.",
  },
} as const;

export type WatchPatternFocus = keyof typeof patternEntries;

export type WatchPatternLookupInput = {
  readonly patternFocus: WatchPatternFocus;
};

export type WatchPatternLookupOutput = {
  readonly keyDate: string;
  readonly patternFocus: WatchPatternFocus;
  readonly verifiedStatement: string;
};

export const lookupWatchPatternFamily = (
  input: WatchPatternLookupInput,
): WatchPatternLookupOutput => {
  const entry = patternEntries[input.patternFocus];
  if (entry === undefined)
    simpleError(
      "patternFocus",
      "Watch pattern focus is not supported.",
      "unsupported_pattern_focus",
    );
  return {
    keyDate: entry.keyDate,
    patternFocus: input.patternFocus,
    verifiedStatement: entry.statement,
  };
};

export const watchPatternExample = {
  input: { patternFocus: "relationship" },
  output: {
    keyDate: "taxonomy",
    patternFocus: "relationship",
    verifiedStatement:
      "Guilloché describes the broader engraving technique, Clous de Paris is a guilloché motif, and perlage is a separate circular surface finish rather than a synonym.",
  },
} satisfies ToolExample<WatchPatternLookupInput, WatchPatternLookupOutput>;

export const watchPatternTool = createSimpleTool({
  calculate: (input) =>
    lookupWatchPatternFamily({
      patternFocus: input.patternFocus as WatchPatternFocus,
    }),
  description:
    "Classify guilloché, Clous de Paris, perlage, their relationship, and hand-versus-machine execution without treating distinct finish families as synonyms.",
  id: "horology/guilloche-perlage-pattern-family-lookup",
  inputs: [
    {
      enum: [
        "guilloche",
        "clousDeParis",
        "perlage",
        "relationship",
        "execution",
      ],
      id: "patternFocus",
      kind: "string",
      label: "Guilloché or perlage pattern focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Taxonomy or process status" },
    {
      id: "patternFocus",
      kind: "string",
      label: "Guilloché or perlage pattern focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified watch-pattern statement",
    },
  ],
  title: "Guilloché Perlage Pattern Family Lookup",
});

export const runWatchPattern = watchPatternTool.execute;
export default watchPatternTool;

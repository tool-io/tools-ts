import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const taxonomyEntries = {
  conglomerateControl: {
    keyDate: "ownership classification",
    statement:
      "A brand is conglomerate-controlled when a larger group owns or controls it; market language can still describe the brand as a marque within that group.",
  },
  independentOwnership: {
    keyDate: "ownership classification",
    statement:
      "Independent ownership means no controlling conglomerate relationship, but it does not by itself imply small scale, in-house production, luxury, or collector value.",
  },
  manufactureDepth: {
    keyDate: "evidence classification",
    statement:
      "Manufacture depth is the share and character of design, machining, finishing, assembly, adjustment, casing, and service performed by the named entity or its documented partners.",
  },
  microbrand: {
    keyDate: "market term",
    statement:
      "Microbrand is a loose market term for a comparatively small independent watch business; there is no universal annual-output or staffing boundary.",
  },
  productionScale: {
    keyDate: "maker-specific",
    statement:
      "Production scale must be evidenced by annual output, product cadence, and manufacturing organization; price positioning and social-media following are not production evidence.",
  },
} as const;

export type WatchBrandTaxonomyFocus = keyof typeof taxonomyEntries;

export type WatchBrandTaxonomyLookupInput = {
  readonly taxonomyFocus: WatchBrandTaxonomyFocus;
};

export type WatchBrandTaxonomyLookupOutput = {
  readonly keyDate: string;
  readonly taxonomyFocus: WatchBrandTaxonomyFocus;
  readonly verifiedStatement: string;
};

export const lookupWatchBrandTaxonomy = (
  input: WatchBrandTaxonomyLookupInput,
): WatchBrandTaxonomyLookupOutput => {
  const entry = taxonomyEntries[input.taxonomyFocus];
  if (entry === undefined)
    simpleError(
      "taxonomyFocus",
      "Watch-brand taxonomy focus is not supported.",
      "unsupported_taxonomy_focus",
    );
  return {
    keyDate: entry.keyDate,
    taxonomyFocus: input.taxonomyFocus,
    verifiedStatement: entry.statement,
  };
};

export const watchBrandTaxonomyExample = {
  input: { taxonomyFocus: "microbrand" },
  output: {
    keyDate: "market term",
    taxonomyFocus: "microbrand",
    verifiedStatement:
      "Microbrand is a loose market term for a comparatively small independent watch business; there is no universal annual-output or staffing boundary.",
  },
} satisfies ToolExample<
  WatchBrandTaxonomyLookupInput,
  WatchBrandTaxonomyLookupOutput
>;

export const watchBrandTaxonomyTool = createSimpleTool({
  calculate: (input) =>
    lookupWatchBrandTaxonomy({
      taxonomyFocus: input.taxonomyFocus as WatchBrandTaxonomyFocus,
    }),
  description:
    "Separate conglomerate control, independent ownership, microbrand market usage, production scale, and manufacture depth without one universal tier boundary.",
  id: "horology/watch-brand-taxonomy-lookup",
  inputs: [
    {
      enum: [
        "independentOwnership",
        "conglomerateControl",
        "microbrand",
        "productionScale",
        "manufactureDepth",
      ],
      id: "taxonomyFocus",
      kind: "string",
      label: "Watch-brand ownership and production-scale taxonomy focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Taxonomy context" },
    {
      id: "taxonomyFocus",
      kind: "string",
      label: "Watch-brand ownership and production-scale taxonomy focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified watch-brand taxonomy statement",
    },
  ],
  title: "Watch Brand Taxonomy Lookup",
});

export const runWatchBrandTaxonomy = watchBrandTaxonomyTool.execute;
export default watchBrandTaxonomyTool;

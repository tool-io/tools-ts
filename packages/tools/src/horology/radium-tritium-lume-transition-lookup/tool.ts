import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const lumeEntries = {
  datingCaution: {
    keyDate: "approximate transition only",
    statement:
      "Material transition dates are not model-by-model production dates. Use brand records, reference documentation, and measured markings for attribution.",
  },
  healthHazard: {
    keyDate: "historical occupational evidence",
    statement:
      "Radium dial painters suffered serious internal radiation injury after ingesting radium paint; intact radium timepieces should not be dismantled, per EPA guidance.",
  },
  laterIsotopes: {
    keyDate: "after the radium period",
    statement:
      "Tritium and promethium-147 became nuclides of choice for many radioluminescent timepieces and presented a much lower radiological hazard than radium, but remained radioactive.",
  },
  materials: {
    keyDate: "historical",
    statement:
      "Radium-era luminous paint commonly used zinc sulfide activated by radium or mesothorium; tritium timepieces used tritium-activated radioluminescent material.",
  },
  transition: {
    keyDate: "approximately 1968 for radium timepieces",
    statement:
      "The US NRC report states that radium had not been used in radioluminescent watches since approximately 1968; this is not a universal brand cutoff.",
  },
} as const;

export type LumeTransitionFocus = keyof typeof lumeEntries;

export type LumeTransitionLookupInput = {
  readonly transitionFocus: LumeTransitionFocus;
};

export type LumeTransitionLookupOutput = {
  readonly keyDate: string;
  readonly transitionFocus: LumeTransitionFocus;
  readonly verifiedStatement: string;
};

export const lookupRadiumTritiumTransition = (
  input: LumeTransitionLookupInput,
): LumeTransitionLookupOutput => {
  const entry = lumeEntries[input.transitionFocus];
  if (entry === undefined)
    simpleError(
      "transitionFocus",
      "Lume transition focus is not supported.",
      "unsupported_transition_focus",
    );
  return {
    keyDate: entry.keyDate,
    transitionFocus: input.transitionFocus,
    verifiedStatement: entry.statement,
  };
};

export const lumeTransitionExample = {
  input: { transitionFocus: "transition" },
  output: {
    keyDate: "approximately 1968 for radium timepieces",
    transitionFocus: "transition",
    verifiedStatement:
      "The US NRC report states that radium had not been used in radioluminescent watches since approximately 1968; this is not a universal brand cutoff.",
  },
} satisfies ToolExample<LumeTransitionLookupInput, LumeTransitionLookupOutput>;

export const lumeTransitionTool = createSimpleTool({
  calculate: (input) =>
    lookupRadiumTritiumTransition({
      transitionFocus: input.transitionFocus as LumeTransitionFocus,
    }),
  description:
    "Return an official-source fact about radium and tritium watch-lume materials, the approximate transition, hazards, or dating limitations.",
  id: "horology/radium-tritium-lume-transition-lookup",
  inputs: [
    {
      enum: [
        "materials",
        "transition",
        "laterIsotopes",
        "healthHazard",
        "datingCaution",
      ],
      id: "transitionFocus",
      kind: "string",
      label: "Radium-to-tritium lume transition focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Key date or status" },
    {
      id: "transitionFocus",
      kind: "string",
      label: "Radium-to-tritium lume transition focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified lume statement",
    },
  ],
  title: "Radium Tritium Lume Transition Lookup",
});

export const runLumeTransition = lumeTransitionTool.execute;
export default lumeTransitionTool;

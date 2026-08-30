import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const isoEntries = {
  analogueMarkings: {
    keyDate: "ISO 6425:2018",
    statement:
      "For an analogue diving-time indicator, the standard requires clearly indicated markings every five minutes.",
  },
  handlingProtection: {
    keyDate: "ISO 6425:2018",
    statement:
      "The diving-time indicator must be protected against inadvertent handling.",
  },
  resolution: {
    keyDate: "ISO 6425:2018",
    statement:
      "The diving-time indicator must read elapsed diving time with a resolution of one minute or better over at least sixty minutes.",
  },
  scope: {
    keyDate: "ISO 6425:2018",
    statement:
      "The current ISO 6425 applies to divers' watches and saturation-divers' watches, including their requirements and test methods.",
  },
  unidirectionalBezel: {
    keyDate: "dive-watch design",
    statement:
      "A unidirectional elapsed-time bezel limits accidental forward adjustment, but a watch's diver-watch status must be established from the applicable standard and manufacturer claim rather than appearance alone.",
  },
} as const;

export type Iso6425Focus = keyof typeof isoEntries;

export type Iso6425LookupInput = {
  readonly requirementFocus: Iso6425Focus;
};

export type Iso6425LookupOutput = {
  readonly keyDate: string;
  readonly requirementFocus: Iso6425Focus;
  readonly verifiedStatement: string;
};

export const lookupIso6425DivingIndicator = (
  input: Iso6425LookupInput,
): Iso6425LookupOutput => {
  const entry = isoEntries[input.requirementFocus];
  if (entry === undefined)
    simpleError(
      "requirementFocus",
      "ISO 6425 requirement focus is not supported.",
      "unsupported_requirement_focus",
    );
  return {
    keyDate: entry.keyDate,
    requirementFocus: input.requirementFocus,
    verifiedStatement: entry.statement,
  };
};

export const iso6425Example = {
  input: { requirementFocus: "resolution" },
  output: {
    keyDate: "ISO 6425:2018",
    requirementFocus: "resolution",
    verifiedStatement:
      "The diving-time indicator must read elapsed diving time with a resolution of one minute or better over at least sixty minutes.",
  },
} satisfies ToolExample<Iso6425LookupInput, Iso6425LookupOutput>;

export const iso6425Tool = createSimpleTool({
  calculate: (input) =>
    lookupIso6425DivingIndicator({
      requirementFocus: input.requirementFocus as Iso6425Focus,
    }),
  description:
    "Return the current ISO 6425 scope, one-minute resolution, five-minute marking, handling-protection, or unidirectional-bezel design context.",
  id: "horology/iso-6425-diving-time-indicator-lookup",
  inputs: [
    {
      enum: [
        "scope",
        "resolution",
        "analogueMarkings",
        "handlingProtection",
        "unidirectionalBezel",
      ],
      id: "requirementFocus",
      kind: "string",
      label: "ISO 6425 diving-time indicator focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Standard or design context" },
    {
      id: "requirementFocus",
      kind: "string",
      label: "ISO 6425 diving-time indicator focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified ISO 6425 statement",
    },
  ],
  title: "ISO 6425 Diving Time Indicator Lookup",
});

export const runIso6425 = iso6425Tool.execute;
export default iso6425Tool;

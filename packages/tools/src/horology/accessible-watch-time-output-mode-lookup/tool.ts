import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const outputEntries = {
  audio: {
    keyDate: "accessibility mode",
    statement:
      "A talking watch announces time through audio; this is one accessibility mode and does not make the physical hands audible.",
  },
  haptic: {
    keyDate: "accessibility mode",
    statement:
      "A haptic watch communicates through touch or vibration and can provide private time feedback without spoken audio.",
  },
  inclusiveDesign: {
    keyDate: "Citizen Touch Time",
    statement:
      "Citizen developed its Touch Time watch with blind and visually impaired users, using raised markers and a shaped hour hand to tell time by touch while preserving a conventional appearance.",
  },
  tactile: {
    keyDate: "accessibility mode",
    statement:
      "A tactile watch communicates through touch; dial geometry, hand shape, and marker spacing must be designed and learned as an interface.",
  },
  terminology: {
    keyDate: "terminology correction",
    statement:
      "Audible hands are not a standard mechanism. A talking or accessible watch may use speech, vibration, or touch, and should be identified by the actual output channel.",
  },
} as const;

export type AccessibleTimeOutputFocus = keyof typeof outputEntries;

export type AccessibleTimeOutputLookupInput = {
  readonly outputFocus: AccessibleTimeOutputFocus;
};

export type AccessibleTimeOutputLookupOutput = {
  readonly keyDate: string;
  readonly outputFocus: AccessibleTimeOutputFocus;
  readonly verifiedStatement: string;
};

export const lookupAccessibleWatchTimeOutput = (
  input: AccessibleTimeOutputLookupInput,
): AccessibleTimeOutputLookupOutput => {
  const entry = outputEntries[input.outputFocus];
  if (entry === undefined)
    simpleError(
      "outputFocus",
      "Accessible watch output focus is not supported.",
      "unsupported_output_focus",
    );
  return {
    keyDate: entry.keyDate,
    outputFocus: input.outputFocus,
    verifiedStatement: entry.statement,
  };
};

export const accessibleOutputExample = {
  input: { outputFocus: "tactile" },
  output: {
    keyDate: "accessibility mode",
    outputFocus: "tactile",
    verifiedStatement:
      "A tactile watch communicates through touch; dial geometry, hand shape, and marker spacing must be designed and learned as an interface.",
  },
} satisfies ToolExample<
  AccessibleTimeOutputLookupInput,
  AccessibleTimeOutputLookupOutput
>;

export const accessibleOutputTool = createSimpleTool({
  calculate: (input) =>
    lookupAccessibleWatchTimeOutput({
      outputFocus: input.outputFocus as AccessibleTimeOutputFocus,
    }),
  description:
    "Return an audio, haptic, tactile, inclusive-design, or terminology fact for accessible watch time output instead of inventing audible hands.",
  id: "horology/accessible-watch-time-output-mode-lookup",
  inputs: [
    {
      enum: ["audio", "haptic", "tactile", "inclusiveDesign", "terminology"],
      id: "outputFocus",
      kind: "string",
      label: "Accessible watch time-output focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Accessibility context" },
    {
      id: "outputFocus",
      kind: "string",
      label: "Accessible watch time-output focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified accessibility statement",
    },
  ],
  title: "Accessible Watch Time Output Mode Lookup",
});

export const runAccessibleOutput = accessibleOutputTool.execute;
export default accessibleOutputTool;

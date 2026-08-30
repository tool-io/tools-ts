import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const frequencyEntries = {
  fourHertz: {
    keyDate: "common modern frequency",
    statement:
      "A 4 Hz mechanical oscillator corresponds to 28,800 vibrations or beats per hour, conventionally eight beats per second.",
  },
  fiveHertz: {
    keyDate: "Grand Seiko Hi-Beat 36000",
    statement:
      "A 5 Hz oscillator corresponds to 36,000 vibrations per hour and ten beats per second; Grand Seiko uses this designation for its Hi-Beat 36000 family.",
  },
  powerTradeoff: {
    keyDate: "design tradeoff",
    statement:
      "Grand Seiko states that faster rotation can take a toll on power reserve and movement longevity, requiring component and mainspring engineering to manage the load.",
  },
  rateCaution: {
    keyDate: "performance comparison",
    statement:
      "A 5 Hz frequency does not by itself guarantee better daily accuracy than a well-regulated 4 Hz movement; design, poise, torque, regulation, and test results determine performance.",
  },
  termCaution: {
    keyDate: "market terminology",
    statement:
      "High-beat is a usage term whose threshold can vary by period and market; compare the explicit hertz or vibrations-per-hour figure instead of relying on the label.",
  },
} as const;

export type FrequencyComparisonFocus = keyof typeof frequencyEntries;

export type FrequencyComparisonLookupInput = {
  readonly frequencyFocus: FrequencyComparisonFocus;
};

export type FrequencyComparisonLookupOutput = {
  readonly frequencyFocus: FrequencyComparisonFocus;
  readonly keyDate: string;
  readonly verifiedStatement: string;
};

export const lookupFourFiveHertzComparison = (
  input: FrequencyComparisonLookupInput,
): FrequencyComparisonLookupOutput => {
  const entry = frequencyEntries[input.frequencyFocus];
  if (entry === undefined)
    simpleError(
      "frequencyFocus",
      "Frequency comparison focus is not supported.",
      "unsupported_frequency_focus",
    );
  return {
    frequencyFocus: input.frequencyFocus,
    keyDate: entry.keyDate,
    verifiedStatement: entry.statement,
  };
};

export const frequencyComparisonExample = {
  input: { frequencyFocus: "fiveHertz" },
  output: {
    frequencyFocus: "fiveHertz",
    keyDate: "Grand Seiko Hi-Beat 36000",
    verifiedStatement:
      "A 5 Hz oscillator corresponds to 36,000 vibrations per hour and ten beats per second; Grand Seiko uses this designation for its Hi-Beat 36000 family.",
  },
} satisfies ToolExample<
  FrequencyComparisonLookupInput,
  FrequencyComparisonLookupOutput
>;

export const frequencyComparisonTool = createSimpleTool({
  calculate: (input) =>
    lookupFourFiveHertzComparison({
      frequencyFocus: input.frequencyFocus as FrequencyComparisonFocus,
    }),
  description:
    "Return explicit 4 Hz and 5 Hz frequencies plus Grand Seiko's power-reserve, longevity, accuracy, and high-beat terminology cautions.",
  id: "horology/four-five-hertz-high-beat-comparison-lookup",
  inputs: [
    {
      enum: [
        "fourHertz",
        "fiveHertz",
        "powerTradeoff",
        "rateCaution",
        "termCaution",
      ],
      id: "frequencyFocus",
      kind: "string",
      label: "Four-versus-five-hertz comparison focus",
    },
  ],
  outputs: [
    {
      id: "frequencyFocus",
      kind: "string",
      label: "Four-versus-five-hertz comparison focus",
    },
    { id: "keyDate", kind: "string", label: "Frequency context" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified high-beat statement",
    },
  ],
  title: "Four Five Hertz High Beat Comparison Lookup",
});

export const runFrequencyComparison = frequencyComparisonTool.execute;
export default frequencyComparisonTool;

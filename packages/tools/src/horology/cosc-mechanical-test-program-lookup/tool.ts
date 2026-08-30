import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const programEntries = {
  duration: {
    keyDate: "current certified-chronometer page",
    statement:
      "COSC states that the complete testing sequence lasts 12 to 20 days depending on movement type; the detailed sequence shown for a mechanical wristwatch includes 15 measurement days.",
  },
  meanRateWindow: {
    keyDate: "ISO 3159 chronometer certification",
    statement:
      "COSC publishes a historic mean-rate window of -4 to +6 seconds per day for the Chronometer Certified title.",
  },
  movementScope: {
    keyDate: "ISO 3159",
    statement:
      "The historic Chronometer Certified procedure is generally applied to the uncased mechanical wristwatch movement, before casing.",
  },
  positions: {
    keyDate: "five positions",
    statement:
      "COSC lists 6 o'clock, 3 o'clock, 9 o'clock, dial up, and dial down as the five movement positions.",
  },
  standard: {
    keyDate: "ISO 3159",
    statement:
      "COSC bases mechanical wristwatch chronometer certification on ISO 3159, which applies to a watch with a balance-spring oscillator.",
  },
  temperatures: {
    keyDate: "8, 23, and 38 degrees Celsius",
    statement:
      "COSC lists three successive test temperatures: 8, 23, and 38 degrees Celsius.",
  },
} as const;

export type CoscProgramFocus = keyof typeof programEntries;

export type CoscProgramLookupInput = {
  readonly programFocus: CoscProgramFocus;
};

export type CoscProgramLookupOutput = {
  readonly keyDate: string;
  readonly programFocus: CoscProgramFocus;
  readonly verifiedStatement: string;
};

export const lookupCoscMechanicalTestProgram = (
  input: CoscProgramLookupInput,
): CoscProgramLookupOutput => {
  const entry = programEntries[input.programFocus];
  if (entry === undefined)
    simpleError(
      "programFocus",
      "COSC program focus is not supported.",
      "unsupported_program_focus",
    );
  return {
    keyDate: entry.keyDate,
    programFocus: input.programFocus,
    verifiedStatement: entry.statement,
  };
};

export const coscProgramExample = {
  input: { programFocus: "standard" },
  output: {
    keyDate: "ISO 3159",
    programFocus: "standard",
    verifiedStatement:
      "COSC bases mechanical wristwatch chronometer certification on ISO 3159, which applies to a watch with a balance-spring oscillator.",
  },
} satisfies ToolExample<CoscProgramLookupInput, CoscProgramLookupOutput>;

export const coscProgramTool = createSimpleTool({
  calculate: (input) =>
    lookupCoscMechanicalTestProgram({
      programFocus: input.programFocus as CoscProgramFocus,
    }),
  description:
    "Look up a published component of the historic ISO 3159-based COSC mechanical chronometer movement test program.",
  id: "horology/cosc-mechanical-test-program-lookup",
  inputs: [
    {
      enum: [
        "standard",
        "movementScope",
        "duration",
        "positions",
        "temperatures",
        "meanRateWindow",
      ],
      id: "programFocus",
      kind: "string",
      label: "COSC mechanical test-program focus",
    },
  ],
  outputs: [
    {
      id: "keyDate",
      kind: "string",
      label: "Key standard, duration, or category",
    },
    {
      id: "programFocus",
      kind: "string",
      label: "COSC mechanical test-program focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Published COSC program statement",
    },
  ],
  title: "COSC Mechanical Test Program Lookup",
});

export const runCoscProgram = coscProgramTool.execute;
export default coscProgramTool;

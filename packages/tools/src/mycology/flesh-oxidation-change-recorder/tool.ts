import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const OXIDATION_CHANGES = [
  "none",
  "pink-then-black",
  "blue-bruising",
  "red-browning",
  "yellowing",
] as const;

type OxidationChange = (typeof OXIDATION_CHANGES)[number];

const OXIDATION_NOTES: Record<OxidationChange, string> = {
  none: "Flesh does not change color on exposure.",
  "pink-then-black": "Flesh oxidizes pink then black on exposure.",
  "blue-bruising": "Flesh oxidizes blue on exposure.",
  "red-browning": "Flesh oxidizes red then brown on exposure.",
  yellowing: "Flesh oxidizes yellow on exposure.",
};

export type FleshOxidationChangeRecorderInput = {
  readonly change: OxidationChange;
};

export type FleshOxidationChangeRecorderOutput = {
  readonly oxidationNote: string;
};

export const fleshOxidationChangeRecorderExample = {
  input: { change: "blue-bruising" },
  output: { oxidationNote: "Flesh oxidizes blue on exposure." },
} satisfies ToolExample<
  FleshOxidationChangeRecorderInput,
  FleshOxidationChangeRecorderOutput
>;

export const fleshOxidationChangeRecorderTool = createSimpleTool({
  id: "mycology/flesh-oxidation-change-recorder",
  title: "Oxidation Recorder",
  description: "Record how the flesh oxidizes when cut or exposed to air.",
  inputs: [
    {
      enum: OXIDATION_CHANGES,
      id: "change",
      kind: "string",
      label: "Change",
    },
  ],
  outputs: [
    {
      id: "oxidationNote",
      kind: "string",
      label: "Oxidation note",
    },
  ],
  calculate: (input) => {
    const change = input.change as OxidationChange;
    const oxidationNote = OXIDATION_NOTES[change];
    if (oxidationNote === undefined)
      simpleError("change", "Choose a known flesh color change.");
    return { oxidationNote };
  },
});
export const runFleshOxidationChangeRecorder =
  fleshOxidationChangeRecorderTool.execute;
export default fleshOxidationChangeRecorderTool;

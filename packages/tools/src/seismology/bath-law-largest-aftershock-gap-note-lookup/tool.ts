import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const bathLawLargestAftershockGapNoteLookupExample = {
  input: { mainshockMagnitudeMw: 7 },
  output: {
    expectedLargestAftershockMw: 5.8,
    gapUnits: 1.2,
    note: "Statistical regularity, not a deterministic forecast; scatter is large.",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const bathLawLargestAftershockGapNoteLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ mainshockMagnitudeMw }) => ({
      expectedLargestAftershockMw: mainshockMagnitudeMw - 1.2,
      gapUnits: 1.2,
      note: "Statistical regularity, not a deterministic forecast; scatter is large.",
    }))(input as never) as Record<string, unknown>,
  description:
    "Båth's law: the largest aftershock sits about 1.2 magnitude units below its mainshock.",
  id: "seismology/bath-law-largest-aftershock-gap-note-lookup",
  inputs: [
    {
      description: "Mainshock magnitude.",
      id: "mainshockMagnitudeMw",
      kind: "number",
      label: "M",
    },
  ],
  outputs: [
    {
      description: "Expected largest aftershock.",
      id: "expectedLargestAftershockMw",
      kind: "number",
      label: "M_as",
    },
    {
      description: "Båth gap used.",
      id: "gapUnits",
      kind: "number",
      label: "ΔM",
    },
    {
      description: "Empirical status.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Bath Law Largest Aftershock Gap Note Lookup",
});
export const runBathLawLargestAftershockGapNoteLookup =
  bathLawLargestAftershockGapNoteLookupTool.execute;
export { bathLawLargestAftershockGapNoteLookupExample as example };
export default bathLawLargestAftershockGapNoteLookupTool;

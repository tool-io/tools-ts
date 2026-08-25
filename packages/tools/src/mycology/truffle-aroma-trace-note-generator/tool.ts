import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const truffleAromaTraceNoteGeneratorExample = {
  input: { aroma: "nutty" },
  output: { aromaTraceNote: "Distinctive trace: nutty." },
} satisfies ToolExample<
  {
    readonly aroma:
      "faint-none" | "fruity" | "musky-garlic" | "nutty" | "sulfurous";
  },
  {
    readonly aromaTraceNote: string;
  }
>;

export const truffleAromaTraceNoteGeneratorTool = createSimpleTool({
  id: "mycology/truffle-aroma-trace-note-generator",
  title: "Aroma Trace Note",
  description:
    "Generate an aroma trace note from a recorded truffle aroma category, or note the absence of a distinctive trace.",
  inputs: [
    {
      enum: ["musky-garlic", "sulfurous", "nutty", "fruity", "faint-none"],
      id: "aroma",
      label: "Aroma",
      kind: "string",
    },
  ],
  outputs: [
    { id: "aromaTraceNote", label: "Aroma trace note", kind: "string" },
  ],
  calculate: (input) => {
    const aroma = input.aroma as string;
    return {
      aromaTraceNote:
        aroma === "faint-none"
          ? "No distinctive aroma trace."
          : `Distinctive trace: ${aroma}.`,
    };
  },
});
export const runTruffleAromaTraceNoteGenerator =
  truffleAromaTraceNoteGeneratorTool.execute;
export default truffleAromaTraceNoteGeneratorTool;

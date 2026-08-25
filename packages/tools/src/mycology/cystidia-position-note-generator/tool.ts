import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CystidiaPositionNoteGeneratorInput = {
  readonly position:
    "both" | "cortical" | "lamellar-edge" | "lamellar-face" | "terminal";
};

export type CystidiaPositionNoteGeneratorOutput = {
  readonly cystidiaNote: string;
};

export const cystidiaPositionNoteGeneratorExample = {
  input: { position: "lamellar-edge" },
  output: {
    cystidiaNote:
      "Cystidia observed on the lamellar edge (cheilocystidial position).",
  },
} satisfies ToolExample<
  CystidiaPositionNoteGeneratorInput,
  CystidiaPositionNoteGeneratorOutput
>;

export const cystidiaPositionNoteGeneratorTool = createSimpleTool({
  id: "mycology/cystidia-position-note-generator",
  title: "Cystidia Position Note",
  description:
    "Generate a descriptive note for the recorded position of cystidia.",
  inputs: [
    {
      enum: ["lamellar-edge", "lamellar-face", "both", "cortical", "terminal"],
      id: "position",
      kind: "string",
      label: "Cystidia position",
    },
  ],
  outputs: [{ id: "cystidiaNote", label: "Cystidia note", kind: "string" }],
  calculate: (input) => ({
    cystidiaNote: (
      {
        both: "Cystidia observed on both the lamellar edge and face (cheilocystidial and pleurocystidial positions).",
        cortical: "Cystidia observed in the outer cortical tissue.",
        "lamellar-edge":
          "Cystidia observed on the lamellar edge (cheilocystidial position).",
        "lamellar-face":
          "Cystidia observed on the lamellar face (pleurocystidial position).",
        terminal: "Cystidia observed at hyphal termini.",
      } satisfies Record<CystidiaPositionNoteGeneratorInput["position"], string>
    )[input.position as CystidiaPositionNoteGeneratorInput["position"]],
  }),
});
export const runCystidiaPositionNoteGenerator =
  cystidiaPositionNoteGeneratorTool.execute;
export default cystidiaPositionNoteGeneratorTool;

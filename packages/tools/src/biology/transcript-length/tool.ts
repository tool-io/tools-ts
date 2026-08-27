import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const transcriptLengthExample = {
  input: { lengthNt: 850 },
} satisfies ToolExample<{
  readonly lengthNt: number;
}>;

export const transcriptLengthTool = createSimpleTool({
  id: "biology/transcript-length",
  title: "Transcript Length nt",
  description: "Report the length of a transcript in nucleotides.",
  inputs: [
    {
      id: "lengthNt",
      label: "Transcript length",
      kind: "integer",
      minimum: 1,
      unit: "nt",
    },
  ],
  outputs: [
    {
      id: "transcriptLengthNt",
      label: "Transcript length",
      kind: "integer",
      unit: "nt",
    },
  ],
  calculate: (input) => ({ transcriptLengthNt: input.lengthNt as number }),
});
export const runTranscriptLength = transcriptLengthTool.execute;
export default transcriptLengthTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ChitinContentAssayRecorderInput = {
  readonly percentDryWeight: number;
};

export type ChitinContentAssayRecorderOutput = {
  readonly percentDryWeight: number;
};

export const chitinContentAssayRecorderExample = {
  input: { percentDryWeight: 24 },
  output: { percentDryWeight: 24 },
} satisfies ToolExample<
  ChitinContentAssayRecorderInput,
  ChitinContentAssayRecorderOutput
>;

export const chitinContentAssayRecorderTool = createSimpleTool({
  id: "mycology/chitin-content-assay-recorder",
  title: "Chitin Assay Recorder",
  description:
    "Validate and record measured chitin as a percentage of dry weight without imposing universal bands that vary by material and assay method.",
  inputs: [
    {
      id: "percentDryWeight",
      kind: "number",
      label: "Chitin content",
      maximum: 100,
      minimum: 0,
      unit: "% dry weight",
    },
  ],
  outputs: [
    {
      id: "percentDryWeight",
      kind: "number",
      label: "Recorded chitin content",
      maximum: 100,
      minimum: 0,
      unit: "% dry weight",
    },
  ],
  calculate: (input) => {
    return { percentDryWeight: input.percentDryWeight as number };
  },
});
export const runChitinContentAssayRecorder =
  chitinContentAssayRecorderTool.execute;
export default chitinContentAssayRecorderTool;

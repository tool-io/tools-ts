import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type LigninPeroxidaseAssayValueRecorderInput = {
  readonly activityUnitsPerL: number;
};

export type LigninPeroxidaseAssayValueRecorderOutput = {
  readonly lipActivityUperL: number;
};

export const ligninPeroxidaseAssayValueRecorderExample = {
  input: { activityUnitsPerL: 4.2 },
  output: { lipActivityUperL: 4.2 },
} satisfies ToolExample<
  LigninPeroxidaseAssayValueRecorderInput,
  LigninPeroxidaseAssayValueRecorderOutput
>;

export const ligninPeroxidaseAssayValueRecorderTool = createSimpleTool({
  id: "mycology/lignin-peroxidase-assay-value-recorder",
  title: "LiP Assay Recorder",
  description:
    "Validate and record lignin-peroxidase activity in units per litre without imposing assay-independent low, moderate, or high thresholds.",
  inputs: [
    {
      id: "activityUnitsPerL",
      kind: "number",
      label: "LiP activity",
      minimum: 0,
      unit: "U/L",
    },
  ],
  outputs: [
    {
      id: "lipActivityUperL",
      kind: "number",
      label: "LiP activity recorded",
      minimum: 0,
      unit: "U/L",
    },
  ],
  calculate: (input) => {
    const lipActivityUperL = input.activityUnitsPerL as number;
    return { lipActivityUperL };
  },
});
export const runLigninPeroxidaseAssayValueRecorder =
  ligninPeroxidaseAssayValueRecorderTool.execute;
export default ligninPeroxidaseAssayValueRecorderTool;

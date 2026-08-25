import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const ergotAlkaloidAssayRecorderExample = {
  input: { alkaloidPpm: 250 },
  output: { alkaloidPpm: 250 },
} satisfies ToolExample<
  {
    readonly alkaloidPpm: number;
  },
  {
    readonly alkaloidPpm: number;
  }
>;

export const ergotAlkaloidAssayRecorderTool = createSimpleTool({
  id: "mycology/ergot-alkaloid-assay-recorder",
  title: "Ergot Alkaloid Assay",
  description:
    "Validate and record an ergot alkaloid assay concentration in parts per million without applying universal hazard bands that differ by alkaloid profile, species, animal, and jurisdiction.",
  inputs: [
    {
      id: "alkaloidPpm",
      label: "Alkaloid concentration",
      kind: "number",
      minimum: 0,
      unit: "ppm",
    },
  ],
  outputs: [
    {
      id: "alkaloidPpm",
      label: "Recorded alkaloid concentration",
      kind: "number",
      minimum: 0,
      unit: "ppm",
    },
  ],
  calculate: (input) => {
    return { alkaloidPpm: input.alkaloidPpm as number };
  },
});
export const runErgotAlkaloidAssayRecorder =
  ergotAlkaloidAssayRecorderTool.execute;
export default ergotAlkaloidAssayRecorderTool;

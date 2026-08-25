import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HartignetDepthGradeClassifierInput = {
  readonly deepMinimumUm: number;
  readonly depthUm: number;
  readonly superficialMaximumUm: number;
};

export type HartignetDepthGradeClassifierOutput = {
  readonly hartigNetGrade: string;
};

export const hartignetDepthGradeClassifierExample = {
  input: { deepMinimumUm: 20.1, depthUm: 8, superficialMaximumUm: 4.9 },
  output: { hartigNetGrade: "typical" },
} satisfies ToolExample<
  HartignetDepthGradeClassifierInput,
  HartignetDepthGradeClassifierOutput
>;

export const hartignetDepthGradeClassifierTool = createSimpleTool({
  id: "mycology/hartignet-depth-grade-classifier",
  title: "Hartig Net Grade",
  description:
    "Classify Hartig-net penetration depth using study-specific superficial and deep boundaries supplied for the host, fungus, and sectioning method.",
  inputs: [
    { id: "depthUm", kind: "number", label: "Hartig net depth", unit: "µm" },
    {
      id: "superficialMaximumUm",
      kind: "number",
      label: "Superficial maximum",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
    {
      id: "deepMinimumUm",
      kind: "number",
      label: "Deep minimum",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
  ],
  outputs: [
    {
      enum: ["superficial", "typical", "deep"],
      id: "hartigNetGrade",
      kind: "string",
      label: "Hartig net grade",
    },
  ],
  calculate: (input) => {
    const depthUm = input.depthUm as number;
    const superficialMaximumUm = input.superficialMaximumUm as number;
    const deepMinimumUm = input.deepMinimumUm as number;
    if (!(depthUm > 0))
      simpleError("depthUm", "Depth must be greater than zero micrometres.");
    if (!(superficialMaximumUm > 0))
      simpleError(
        "superficialMaximumUm",
        "The superficial maximum must be greater than zero.",
      );
    if (!(deepMinimumUm > superficialMaximumUm))
      simpleError(
        "deepMinimumUm",
        "The deep minimum must exceed the superficial maximum.",
      );
    return {
      hartigNetGrade:
        depthUm <= superficialMaximumUm
          ? "superficial"
          : depthUm < deepMinimumUm
            ? "typical"
            : "deep",
    };
  },
});
export const runHartignetDepthGradeClassifier =
  hartignetDepthGradeClassifierTool.execute;
export default hartignetDepthGradeClassifierTool;

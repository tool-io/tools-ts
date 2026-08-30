import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly twoPhotonDepthMillimeters: number;
  readonly confocalDepthMillimeters: number;
}>;
export type Output = Readonly<{
  readonly depthRatio: number;
  readonly depthImprovementPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.confocalDepthMillimeters <= 0)
    simpleError(
      "confocalDepthMillimeters",
      "Confocal depth must be positive.",
      "invalid_baseline",
    );
  const depthRatio =
    input.twoPhotonDepthMillimeters / input.confocalDepthMillimeters;
  return { depthRatio, depthImprovementPercent: (depthRatio - 1) * 100 };
};

export const exampleInput = {
  twoPhotonDepthMillimeters: 2,
  confocalDepthMillimeters: 0.5,
} satisfies Input;
export const exampleOutput = {
  depthRatio: 4,
  depthImprovementPercent: 300,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      twoPhotonDepthMillimeters: input.twoPhotonDepthMillimeters as number,
      confocalDepthMillimeters: input.confocalDepthMillimeters as number,
    }),
  description: "Compare measured two-photon and confocal imaging depths.",
  id: "laser/two-photon-depth-comparison",
  inputs: [
    {
      id: "twoPhotonDepthMillimeters",
      label: "Two-photon imaging depth",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "confocalDepthMillimeters",
      label: "Confocal imaging depth",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    { id: "depthRatio", label: "Depth ratio", kind: "number", minimum: 0 },
    {
      id: "depthImprovementPercent",
      label: "Depth improvement",
      kind: "number",
      unit: "%",
    },
  ],
  title: "Two-Photon Depth Comparison",
});

export const run = tool.execute;
export default tool;

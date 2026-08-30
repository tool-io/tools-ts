import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PlugCutterSizeInput = Readonly<{
  readonly recessDiameterMillimeters: number;
  readonly interferenceMillimeters: number;
}>;
export type PlugCutterSizeOutput = Readonly<{
  readonly cutterDiameterMillimeters: number;
}>;

export const calculatePlugCutterSize = (
  x: PlugCutterSizeInput,
): PlugCutterSizeOutput => {
  if (
    !Number.isFinite(x.recessDiameterMillimeters) ||
    x.recessDiameterMillimeters < 0
  )
    simpleError(
      "recessDiameterMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.interferenceMillimeters) ||
    x.interferenceMillimeters < 0
  )
    simpleError(
      "interferenceMillimeters",
      "Provide a finite number at least 0.",
    );
  const cutterDiameterMillimeters =
    x.recessDiameterMillimeters + x.interferenceMillimeters;
  if (!Number.isFinite(cutterDiameterMillimeters))
    simpleError(
      "cutterDiameterMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    cutterDiameterMillimeters: Object.is(cutterDiameterMillimeters, -0)
      ? 0
      : cutterDiameterMillimeters,
  };
};

export const example = {
  input: { recessDiameterMillimeters: 10, interferenceMillimeters: 0.1 },
  output: { cutterDiameterMillimeters: 10.1 },
} satisfies ToolExample<PlugCutterSizeInput, PlugCutterSizeOutput>;

export const tool = createSimpleTool({
  id: "carpentry/plug-cutter-size",
  title: "Plug Cutter Size",
  description:
    "Nominal plug-cutter diameter for a drilled recess when a chosen diametral interference is desired; verify actual plug yield and grain fit.",
  inputs: [
    {
      id: "recessDiameterMillimeters",
      kind: "number",
      label: "Recess Diameter Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "interferenceMillimeters",
      kind: "number",
      label: "Interference Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "cutterDiameterMillimeters",
      kind: "number",
      label: "Cutter Diameter Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculatePlugCutterSize({
      recessDiameterMillimeters: input.recessDiameterMillimeters as number,
      interferenceMillimeters: input.interferenceMillimeters as number,
    }),
});
export const plugCutterSizeTool = tool;
export const runPlugCutterSize = tool.execute;
export default tool;

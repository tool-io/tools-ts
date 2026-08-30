import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TvsClampingRatioInput = Readonly<{
  readonly clampingVoltageV: number;
  readonly standoffVoltageV: number;
}>;
export type TvsClampingRatioOutput = Readonly<{
  readonly clampingRatio: number;
}>;

export const calculateTvsClampingRatio = (
  x: TvsClampingRatioInput,
): TvsClampingRatioOutput => {
  if (!Number.isFinite(x.clampingVoltageV) || x.clampingVoltageV < 0)
    simpleError("clampingVoltageV", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.standoffVoltageV) || x.standoffVoltageV < 0)
    simpleError("standoffVoltageV", "Provide a finite number at least 0.");
  if (!(x.standoffVoltageV > 0 && x.clampingVoltageV >= x.standoffVoltageV))
    simpleError(
      "input",
      "Stand-off must be positive and clamping voltage must not be lower.",
    );
  const clampingRatio = x.clampingVoltageV / x.standoffVoltageV;
  if (!Number.isFinite(clampingRatio))
    simpleError("clampingRatio", "The inputs produce an invalid result.");
  return { clampingRatio: Object.is(clampingRatio, -0) ? 0 : clampingRatio };
};

export const example = {
  input: { clampingVoltageV: 20, standoffVoltageV: 10 },
  output: { clampingRatio: 2 },
} satisfies ToolExample<TvsClampingRatioInput, TvsClampingRatioOutput>;

export const tool = createSimpleTool({
  id: "electronics/tvs-clamping-ratio",
  title: "TVS Clamping Ratio",
  description:
    "Compare a TVS diode's specified clamping voltage with its stand-off voltage as a dimensionless ratio.",
  inputs: [
    {
      id: "clampingVoltageV",
      kind: "number",
      label: "Clamping voltage",
      unit: "V",
      minimum: 0,
    },
    {
      id: "standoffVoltageV",
      kind: "number",
      label: "Stand-off voltage",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "clampingRatio",
      kind: "number",
      label: "Clamping-to-stand-off ratio",
    },
  ],
  calculate: (input) =>
    calculateTvsClampingRatio({
      clampingVoltageV: input.clampingVoltageV as number,
      standoffVoltageV: input.standoffVoltageV as number,
    }),
});
export const tvsClampingRatioTool = tool;
export const runTvsClampingRatio = tool.execute;
export default tool;

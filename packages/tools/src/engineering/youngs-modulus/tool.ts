import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type YoungsModulusInput = Readonly<{
  readonly stressPascals: number;
  readonly strain: number;
}>;
export type YoungsModulusOutput = Readonly<{
  readonly modulusPascals: number;
}>;

export const calculateYoungsModulus = (
  x: YoungsModulusInput,
): YoungsModulusOutput => {
  if (!Number.isFinite(x.stressPascals) || x.stressPascals < 0)
    simpleError("stressPascals", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.strain) || x.strain < 0)
    simpleError("strain", "Provide a finite number at least 0.");
  const modulusPascals = x.stressPascals / x.strain;
  if (!Number.isFinite(modulusPascals))
    simpleError(
      "modulusPascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { modulusPascals: Object.is(modulusPascals, -0) ? 0 : modulusPascals };
};

export const example = {
  input: { stressPascals: 200000000, strain: 0.001 },
  output: { modulusPascals: 200000000000 },
} satisfies ToolExample<YoungsModulusInput, YoungsModulusOutput>;

export const tool = createSimpleTool({
  id: "engineering/youngs-modulus",
  title: "Youngs Modulus",
  description:
    "Young’s modulus from uniaxial engineering stress and elastic engineering strain; use only within the linear elastic region.",
  inputs: [
    {
      id: "stressPascals",
      kind: "number",
      label: "Stress Pascals",
      unit: "Pa",
      minimum: 0,
    },
    { id: "strain", kind: "number", label: "Strain", minimum: 0 },
  ],
  outputs: [
    {
      id: "modulusPascals",
      kind: "number",
      label: "Modulus Pascals",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculateYoungsModulus({
      stressPascals: input.stressPascals as number,
      strain: input.strain as number,
    }),
});
export const youngsModulusTool = tool;
export const runYoungsModulus = tool.execute;
export default tool;

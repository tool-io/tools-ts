import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BeamMomentUniformInput = Readonly<{
  readonly uniformLoadNPerM: number;
  readonly spanM: number;
}>;
export type BeamMomentUniformOutput = Readonly<{
  readonly maximumMomentNm: number;
}>;

export const calculateBeamMomentUniform = (
  x: BeamMomentUniformInput,
): BeamMomentUniformOutput => {
  if (!Number.isFinite(x.uniformLoadNPerM) || x.uniformLoadNPerM < 0)
    simpleError("uniformLoadNPerM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.spanM) || x.spanM < 0)
    simpleError("spanM", "Provide a finite number at least 0.");
  const maximumMomentNm = (x.uniformLoadNPerM * x.spanM ** 2) / 8;
  if (!Number.isFinite(maximumMomentNm))
    simpleError("maximumMomentNm", "The inputs produce an invalid result.");
  return {
    maximumMomentNm: Object.is(maximumMomentNm, -0) ? 0 : maximumMomentNm,
  };
};

export const example = {
  input: { uniformLoadNPerM: 1000, spanM: 2 },
  output: { maximumMomentNm: 500 },
} satisfies ToolExample<BeamMomentUniformInput, BeamMomentUniformOutput>;

export const tool = createSimpleTool({
  id: "construction/beam-moment-uniform",
  title: "Uniform Beam Moment",
  description:
    "Find maximum positive bending moment of a simply supported beam carrying a constant uniform load over its full span.",
  inputs: [
    {
      id: "uniformLoadNPerM",
      kind: "number",
      label: "Uniform load",
      unit: "N/m",
      minimum: 0,
    },
    {
      id: "spanM",
      kind: "number",
      label: "Support span",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "maximumMomentNm",
      kind: "number",
      label: "Maximum bending moment",
      unit: "N·m",
    },
  ],
  calculate: (input) =>
    calculateBeamMomentUniform({
      uniformLoadNPerM: input.uniformLoadNPerM as number,
      spanM: input.spanM as number,
    }),
});
export const beamMomentUniformTool = tool;
export const runBeamMomentUniform = tool.execute;
export default tool;

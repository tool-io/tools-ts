import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BeamMaxMomentUniformInput = Readonly<{
  readonly loadNewtonsPerMeter: number;
  readonly spanMeters: number;
}>;
export type BeamMaxMomentUniformOutput = Readonly<{
  readonly momentNewtonMeters: number;
}>;

export const calculateBeamMaxMomentUniform = (
  x: BeamMaxMomentUniformInput,
): BeamMaxMomentUniformOutput => {
  if (!Number.isFinite(x.loadNewtonsPerMeter) || x.loadNewtonsPerMeter < 0)
    simpleError("loadNewtonsPerMeter", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.spanMeters) || x.spanMeters < 0)
    simpleError("spanMeters", "Provide a finite number at least 0.");
  const momentNewtonMeters = (x.loadNewtonsPerMeter * x.spanMeters ** 2) / 8;
  if (!Number.isFinite(momentNewtonMeters))
    simpleError(
      "momentNewtonMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    momentNewtonMeters: Object.is(momentNewtonMeters, -0)
      ? 0
      : momentNewtonMeters,
  };
};

export const example = {
  input: { loadNewtonsPerMeter: 1000, spanMeters: 4 },
  output: { momentNewtonMeters: 2000 },
} satisfies ToolExample<BeamMaxMomentUniformInput, BeamMaxMomentUniformOutput>;

export const tool = createSimpleTool({
  id: "engineering/beam-max-moment-uniform",
  title: "Beam Max Moment Uniform",
  description:
    "Maximum sagging moment wL²/8 in a simply supported beam with a full-span uniform load.",
  inputs: [
    {
      id: "loadNewtonsPerMeter",
      kind: "number",
      label: "Load Newtons Per Meter",
      unit: "N/m",
      minimum: 0,
    },
    {
      id: "spanMeters",
      kind: "number",
      label: "Span Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "momentNewtonMeters",
      kind: "number",
      label: "Moment Newton Meters",
      unit: "N·m",
    },
  ],
  calculate: (input) =>
    calculateBeamMaxMomentUniform({
      loadNewtonsPerMeter: input.loadNewtonsPerMeter as number,
      spanMeters: input.spanMeters as number,
    }),
});
export const beamMaxMomentUniformTool = tool;
export const runBeamMaxMomentUniform = tool.execute;
export default tool;

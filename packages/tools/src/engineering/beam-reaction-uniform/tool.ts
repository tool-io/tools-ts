import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BeamReactionUniformInput = Readonly<{
  readonly loadNewtonsPerMeter: number;
  readonly spanMeters: number;
}>;
export type BeamReactionUniformOutput = Readonly<{
  readonly reactionNewtons: number;
}>;

export const calculateBeamReactionUniform = (
  x: BeamReactionUniformInput,
): BeamReactionUniformOutput => {
  if (!Number.isFinite(x.loadNewtonsPerMeter) || x.loadNewtonsPerMeter < 0)
    simpleError("loadNewtonsPerMeter", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.spanMeters) || x.spanMeters < 0)
    simpleError("spanMeters", "Provide a finite number at least 0.");
  const reactionNewtons = (x.loadNewtonsPerMeter * x.spanMeters) / 2;
  if (!Number.isFinite(reactionNewtons))
    simpleError(
      "reactionNewtons",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    reactionNewtons: Object.is(reactionNewtons, -0) ? 0 : reactionNewtons,
  };
};

export const example = {
  input: { loadNewtonsPerMeter: 1000, spanMeters: 4 },
  output: { reactionNewtons: 2000 },
} satisfies ToolExample<BeamReactionUniformInput, BeamReactionUniformOutput>;

export const tool = createSimpleTool({
  id: "engineering/beam-reaction-uniform",
  title: "Beam Reaction Uniform",
  description:
    "Each end reaction of a simply supported beam carrying a uniformly distributed full-span load.",
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
      id: "reactionNewtons",
      kind: "number",
      label: "Reaction Newtons",
      unit: "N",
    },
  ],
  calculate: (input) =>
    calculateBeamReactionUniform({
      loadNewtonsPerMeter: input.loadNewtonsPerMeter as number,
      spanMeters: input.spanMeters as number,
    }),
});
export const beamReactionUniformTool = tool;
export const runBeamReactionUniform = tool.execute;
export default tool;

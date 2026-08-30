import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BeamDeflectionCantileverPointInput = Readonly<{
  readonly forceNewtons: number;
  readonly lengthMeters: number;
  readonly modulusPascals: number;
  readonly secondMomentMeters4: number;
}>;
export type BeamDeflectionCantileverPointOutput = Readonly<{
  readonly deflectionMeters: number;
}>;

export const calculateBeamDeflectionCantileverPoint = (
  x: BeamDeflectionCantileverPointInput,
): BeamDeflectionCantileverPointOutput => {
  if (!Number.isFinite(x.forceNewtons) || x.forceNewtons < 0)
    simpleError("forceNewtons", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lengthMeters) || x.lengthMeters < 0)
    simpleError("lengthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.modulusPascals) || x.modulusPascals < 0)
    simpleError("modulusPascals", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.secondMomentMeters4) || x.secondMomentMeters4 < 0)
    simpleError("secondMomentMeters4", "Provide a finite number at least 0.");
  const deflectionMeters =
    (x.forceNewtons * x.lengthMeters ** 3) /
    (3 * x.modulusPascals * x.secondMomentMeters4);
  if (!Number.isFinite(deflectionMeters))
    simpleError(
      "deflectionMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    deflectionMeters: Object.is(deflectionMeters, -0) ? 0 : deflectionMeters,
  };
};

export const example = {
  input: {
    forceNewtons: 100,
    lengthMeters: 1,
    modulusPascals: 200000000000,
    secondMomentMeters4: 0.000001,
  },
  output: { deflectionMeters: 0.00016666666666666666 },
} satisfies ToolExample<
  BeamDeflectionCantileverPointInput,
  BeamDeflectionCantileverPointOutput
>;

export const tool = createSimpleTool({
  id: "engineering/beam-deflection-cantilever-point",
  title: "Beam Deflection Cantilever Point",
  description:
    "Free-end deflection of an ideal prismatic cantilever under a point force at the free end, neglecting shear deformation.",
  inputs: [
    {
      id: "forceNewtons",
      kind: "number",
      label: "Force Newtons",
      unit: "N",
      minimum: 0,
    },
    {
      id: "lengthMeters",
      kind: "number",
      label: "Length Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "modulusPascals",
      kind: "number",
      label: "Modulus Pascals",
      unit: "Pa",
      minimum: 0,
    },
    {
      id: "secondMomentMeters4",
      kind: "number",
      label: "Second Moment Meters4",
      unit: "m⁴",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "deflectionMeters",
      kind: "number",
      label: "Deflection Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateBeamDeflectionCantileverPoint({
      forceNewtons: input.forceNewtons as number,
      lengthMeters: input.lengthMeters as number,
      modulusPascals: input.modulusPascals as number,
      secondMomentMeters4: input.secondMomentMeters4 as number,
    }),
});
export const beamDeflectionCantileverPointTool = tool;
export const runBeamDeflectionCantileverPoint = tool.execute;
export default tool;

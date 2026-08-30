import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BeamDeflectionUniformSimpleInput = Readonly<{
  readonly uniformLoadNPerM: number;
  readonly spanM: number;
  readonly elasticModulusPa: number;
  readonly secondMomentM4: number;
}>;
export type BeamDeflectionUniformSimpleOutput = Readonly<{
  readonly midspanDeflectionM: number;
}>;

export const calculateBeamDeflectionUniformSimple = (
  x: BeamDeflectionUniformSimpleInput,
): BeamDeflectionUniformSimpleOutput => {
  if (!Number.isFinite(x.uniformLoadNPerM) || x.uniformLoadNPerM < 0)
    simpleError("uniformLoadNPerM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.spanM) || x.spanM < 0)
    simpleError("spanM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.elasticModulusPa) || x.elasticModulusPa < 0)
    simpleError("elasticModulusPa", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.secondMomentM4) || x.secondMomentM4 < 0)
    simpleError("secondMomentM4", "Provide a finite number at least 0.");
  if (!(x.elasticModulusPa > 0 && x.secondMomentM4 > 0))
    simpleError("input", "Stiffness inputs must be positive.");
  const midspanDeflectionM =
    (5 * x.uniformLoadNPerM * x.spanM ** 4) /
    (384 * x.elasticModulusPa * x.secondMomentM4);
  if (!Number.isFinite(midspanDeflectionM))
    simpleError("midspanDeflectionM", "The inputs produce an invalid result.");
  return {
    midspanDeflectionM: Object.is(midspanDeflectionM, -0)
      ? 0
      : midspanDeflectionM,
  };
};

export const example = {
  input: {
    uniformLoadNPerM: 1000,
    spanM: 2,
    elasticModulusPa: 200000000000,
    secondMomentM4: 0.00001,
  },
  output: { midspanDeflectionM: 0.00010416666666666665 },
} satisfies ToolExample<
  BeamDeflectionUniformSimpleInput,
  BeamDeflectionUniformSimpleOutput
>;

export const tool = createSimpleTool({
  id: "construction/beam-deflection-uniform-simple",
  title: "Simple Beam Deflection",
  description:
    "Estimate midspan elastic deflection of a prismatic, simply supported beam under uniform load using small-deflection Euler–Bernoulli theory; not a code check.",
  inputs: [
    {
      id: "uniformLoadNPerM",
      kind: "number",
      label: "Uniform load",
      unit: "N/m",
      minimum: 0,
    },
    { id: "spanM", kind: "number", label: "Clear span", unit: "m", minimum: 0 },
    {
      id: "elasticModulusPa",
      kind: "number",
      label: "Young's modulus",
      unit: "Pa",
      minimum: 0,
    },
    {
      id: "secondMomentM4",
      kind: "number",
      label: "Second moment of area",
      unit: "m⁴",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "midspanDeflectionM",
      kind: "number",
      label: "Midspan deflection",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateBeamDeflectionUniformSimple({
      uniformLoadNPerM: input.uniformLoadNPerM as number,
      spanM: input.spanM as number,
      elasticModulusPa: input.elasticModulusPa as number,
      secondMomentM4: input.secondMomentM4 as number,
    }),
});
export const beamDeflectionUniformSimpleTool = tool;
export const runBeamDeflectionUniformSimple = tool.execute;
export default tool;

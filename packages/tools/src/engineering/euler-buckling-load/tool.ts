import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EulerBucklingLoadInput = Readonly<{
  readonly modulusPascals: number;
  readonly secondMomentMeters4: number;
  readonly lengthMeters: number;
  readonly effectiveLengthFactor: number;
}>;
export type EulerBucklingLoadOutput = Readonly<{
  readonly criticalNewtons: number;
}>;

export const calculateEulerBucklingLoad = (
  x: EulerBucklingLoadInput,
): EulerBucklingLoadOutput => {
  if (!Number.isFinite(x.modulusPascals) || x.modulusPascals < 0)
    simpleError("modulusPascals", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.secondMomentMeters4) || x.secondMomentMeters4 < 0)
    simpleError("secondMomentMeters4", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lengthMeters) || x.lengthMeters < 0)
    simpleError("lengthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.effectiveLengthFactor) || x.effectiveLengthFactor < 0)
    simpleError("effectiveLengthFactor", "Provide a finite number at least 0.");
  const criticalNewtons =
    (Math.PI ** 2 * x.modulusPascals * x.secondMomentMeters4) /
    (x.effectiveLengthFactor * x.lengthMeters) ** 2;
  if (!Number.isFinite(criticalNewtons))
    simpleError(
      "criticalNewtons",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    criticalNewtons: Object.is(criticalNewtons, -0) ? 0 : criticalNewtons,
  };
};

export const example = {
  input: {
    modulusPascals: 200000000000,
    secondMomentMeters4: 1e-8,
    lengthMeters: 2,
    effectiveLengthFactor: 1,
  },
  output: { criticalNewtons: 4934.802200544679 },
} satisfies ToolExample<EulerBucklingLoadInput, EulerBucklingLoadOutput>;

export const tool = createSimpleTool({
  id: "engineering/euler-buckling-load",
  title: "Euler Buckling Load",
  description:
    "Ideal Euler elastic buckling load π²EI/(KL)² for a slender prismatic column; not a design capacity or inelastic check.",
  inputs: [
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
    {
      id: "lengthMeters",
      kind: "number",
      label: "Length Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "effectiveLengthFactor",
      kind: "number",
      label: "Effective Length Factor",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "criticalNewtons",
      kind: "number",
      label: "Critical Newtons",
      unit: "N",
    },
  ],
  calculate: (input) =>
    calculateEulerBucklingLoad({
      modulusPascals: input.modulusPascals as number,
      secondMomentMeters4: input.secondMomentMeters4 as number,
      lengthMeters: input.lengthMeters as number,
      effectiveLengthFactor: input.effectiveLengthFactor as number,
    }),
});
export const eulerBucklingLoadTool = tool;
export const runEulerBucklingLoad = tool.execute;
export default tool;

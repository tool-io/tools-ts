import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShelfSpanMaxInput = Readonly<{
  readonly allowableDeflectionM: number;
  readonly elasticModulusPa: number;
  readonly secondMomentM4: number;
  readonly uniformLoadNPerM: number;
}>;
export type ShelfSpanMaxOutput = Readonly<{
  readonly maximumSpanM: number;
}>;

export const calculateShelfSpanMax = (
  x: ShelfSpanMaxInput,
): ShelfSpanMaxOutput => {
  if (!Number.isFinite(x.allowableDeflectionM) || x.allowableDeflectionM < 0)
    simpleError("allowableDeflectionM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.elasticModulusPa) || x.elasticModulusPa < 0)
    simpleError("elasticModulusPa", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.secondMomentM4) || x.secondMomentM4 < 0)
    simpleError("secondMomentM4", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.uniformLoadNPerM) || x.uniformLoadNPerM < 0)
    simpleError("uniformLoadNPerM", "Provide a finite number at least 0.");
  if (!(
    x.allowableDeflectionM > 0 &&
    x.elasticModulusPa > 0 &&
    x.secondMomentM4 > 0 &&
    x.uniformLoadNPerM > 0
  ))
    simpleError(
      "input",
      "Deflection limit, stiffness, and load must be positive.",
    );
  const maximumSpanM =
    ((384 * x.elasticModulusPa * x.secondMomentM4 * x.allowableDeflectionM) /
      (5 * x.uniformLoadNPerM)) **
    0.25;
  if (!Number.isFinite(maximumSpanM))
    simpleError("maximumSpanM", "The inputs produce an invalid result.");
  return { maximumSpanM: Object.is(maximumSpanM, -0) ? 0 : maximumSpanM };
};

export const example = {
  input: {
    allowableDeflectionM: 0.002,
    elasticModulusPa: 10000000000,
    secondMomentM4: 0.000001,
    uniformLoadNPerM: 100,
  },
  output: { maximumSpanM: 1.979692801535906 },
} satisfies ToolExample<ShelfSpanMaxInput, ShelfSpanMaxOutput>;

export const tool = createSimpleTool({
  id: "carpentry/shelf-span-max",
  title: "Maximum Shelf Span",
  description:
    "Solve the uniform-load, simply supported elastic-beam formula for maximum span at a specified absolute midspan deflection limit; not a strength check.",
  inputs: [
    {
      id: "allowableDeflectionM",
      kind: "number",
      label: "Deflection limit",
      unit: "m",
      minimum: 0,
    },
    {
      id: "elasticModulusPa",
      kind: "number",
      label: "Shelf modulus",
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
    {
      id: "uniformLoadNPerM",
      kind: "number",
      label: "Uniform load",
      unit: "N/m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "maximumSpanM",
      kind: "number",
      label: "Deflection-limited span",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateShelfSpanMax({
      allowableDeflectionM: input.allowableDeflectionM as number,
      elasticModulusPa: input.elasticModulusPa as number,
      secondMomentM4: input.secondMomentM4 as number,
      uniformLoadNPerM: input.uniformLoadNPerM as number,
    }),
});
export const shelfSpanMaxTool = tool;
export const runShelfSpanMax = tool.execute;
export default tool;

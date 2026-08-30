import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShelfDeflectionInput = Readonly<{
  readonly uniformLoadNewtonsPerMeter: number;
  readonly spanMeters: number;
  readonly elasticModulusPascals: number;
  readonly secondMomentMeters4: number;
}>;
export type ShelfDeflectionOutput = Readonly<{
  readonly deflectionMeters: number;
}>;

export const calculateShelfDeflection = (
  x: ShelfDeflectionInput,
): ShelfDeflectionOutput => {
  if (
    !Number.isFinite(x.uniformLoadNewtonsPerMeter) ||
    x.uniformLoadNewtonsPerMeter < 0
  )
    simpleError(
      "uniformLoadNewtonsPerMeter",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.spanMeters) || x.spanMeters < 0)
    simpleError("spanMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.elasticModulusPascals) || x.elasticModulusPascals < 0)
    simpleError("elasticModulusPascals", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.secondMomentMeters4) || x.secondMomentMeters4 < 0)
    simpleError("secondMomentMeters4", "Provide a finite number at least 0.");
  const deflectionMeters =
    (5 * x.uniformLoadNewtonsPerMeter * x.spanMeters ** 4) /
    (384 * x.elasticModulusPascals * x.secondMomentMeters4);
  if (!Number.isFinite(deflectionMeters))
    simpleError(
      "deflectionMeters",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    deflectionMeters: Object.is(deflectionMeters, -0) ? 0 : deflectionMeters,
  };
};

export const example = {
  input: {
    uniformLoadNewtonsPerMeter: 100,
    spanMeters: 1,
    elasticModulusPascals: 10000000000,
    secondMomentMeters4: 0.000001,
  },
  output: { deflectionMeters: 0.00013020833333333333 },
} satisfies ToolExample<ShelfDeflectionInput, ShelfDeflectionOutput>;

export const tool = createSimpleTool({
  id: "carpentry/shelf-deflection",
  title: "Shelf Deflection",
  description:
    "Maximum midspan deflection of a simply supported shelf under uniform load, from wL⁴/(EI); assumes small elastic deflection.",
  inputs: [
    {
      id: "uniformLoadNewtonsPerMeter",
      kind: "number",
      label: "Uniform Load Newtons Per Meter",
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
    {
      id: "elasticModulusPascals",
      kind: "number",
      label: "Elastic Modulus Pascals",
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
    calculateShelfDeflection({
      uniformLoadNewtonsPerMeter: input.uniformLoadNewtonsPerMeter as number,
      spanMeters: input.spanMeters as number,
      elasticModulusPascals: input.elasticModulusPascals as number,
      secondMomentMeters4: input.secondMomentMeters4 as number,
    }),
});
export const shelfDeflectionTool = tool;
export const runShelfDeflection = tool.execute;
export default tool;

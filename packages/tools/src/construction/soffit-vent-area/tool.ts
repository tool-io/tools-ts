import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SoffitVentAreaInput = Readonly<{
  readonly ventCount: number;
  readonly grossSquareCentimetersPerVent: number;
  readonly freeAreaFraction: number;
}>;
export type SoffitVentAreaOutput = Readonly<{
  readonly netFreeSquareCentimeters: number;
}>;

export const calculateSoffitVentArea = (
  x: SoffitVentAreaInput,
): SoffitVentAreaOutput => {
  if (
    !Number.isFinite(x.ventCount) ||
    !Number.isSafeInteger(x.ventCount) ||
    x.ventCount < 0
  )
    simpleError("ventCount", "Provide a safe integer at least 0.");
  if (
    !Number.isFinite(x.grossSquareCentimetersPerVent) ||
    x.grossSquareCentimetersPerVent < 0
  )
    simpleError(
      "grossSquareCentimetersPerVent",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.freeAreaFraction) || x.freeAreaFraction < 0)
    simpleError("freeAreaFraction", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.ventCount) || x.freeAreaFraction > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const netFreeSquareCentimeters =
    x.ventCount * x.grossSquareCentimetersPerVent * x.freeAreaFraction;
  if (!Number.isFinite(netFreeSquareCentimeters))
    simpleError(
      "netFreeSquareCentimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    netFreeSquareCentimeters: Object.is(netFreeSquareCentimeters, -0)
      ? 0
      : netFreeSquareCentimeters,
  };
};

export const example = {
  input: {
    ventCount: 10,
    grossSquareCentimetersPerVent: 100,
    freeAreaFraction: 0.6,
  },
  output: { netFreeSquareCentimeters: 600 },
} satisfies ToolExample<SoffitVentAreaInput, SoffitVentAreaOutput>;

export const tool = createSimpleTool({
  id: "construction/soffit-vent-area",
  title: "Soffit Vent Area",
  description:
    "Total soffit net-free vent area from vent count, gross aperture area each, and manufacturer-stated free-area fraction.",
  inputs: [
    { id: "ventCount", kind: "integer", label: "Vent Count", minimum: 0 },
    {
      id: "grossSquareCentimetersPerVent",
      kind: "number",
      label: "Gross Square Centimeters Per Vent",
      unit: "cm²",
      minimum: 0,
    },
    {
      id: "freeAreaFraction",
      kind: "number",
      label: "Free Area Fraction",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "netFreeSquareCentimeters",
      kind: "number",
      label: "Net Free Square Centimeters",
      unit: "cm²",
    },
  ],
  calculate: (input) =>
    calculateSoffitVentArea({
      ventCount: input.ventCount as number,
      grossSquareCentimetersPerVent:
        input.grossSquareCentimetersPerVent as number,
      freeAreaFraction: input.freeAreaFraction as number,
    }),
});
export const soffitVentAreaTool = tool;
export const runSoffitVentArea = tool.execute;
export default tool;

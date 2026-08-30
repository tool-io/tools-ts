import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LdmosDriftResistanceInput = Readonly<{
  readonly resistivityOhmMeters: number;
  readonly driftLengthMeters: number;
  readonly pathWidthMeters: number;
  readonly pathThicknessMeters: number;
}>;
export type LdmosDriftResistanceOutput = Readonly<{
  readonly driftOhms: number;
}>;

export const calculateLdmosDriftResistance = (
  x: LdmosDriftResistanceInput,
): LdmosDriftResistanceOutput => {
  if (!Number.isFinite(x.resistivityOhmMeters) || x.resistivityOhmMeters < 0)
    simpleError("resistivityOhmMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.driftLengthMeters) || x.driftLengthMeters < 0)
    simpleError("driftLengthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.pathWidthMeters) || x.pathWidthMeters < 0)
    simpleError("pathWidthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.pathThicknessMeters) || x.pathThicknessMeters < 0)
    simpleError("pathThicknessMeters", "Provide a finite number at least 0.");
  const driftOhms =
    (x.resistivityOhmMeters * x.driftLengthMeters) /
    (x.pathWidthMeters * x.pathThicknessMeters);
  if (!Number.isFinite(driftOhms))
    simpleError(
      "driftOhms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { driftOhms: Object.is(driftOhms, -0) ? 0 : driftOhms };
};

export const example = {
  input: {
    resistivityOhmMeters: 0.01,
    driftLengthMeters: 0.0001,
    pathWidthMeters: 0.001,
    pathThicknessMeters: 0.00001,
  },
  output: { driftOhms: 100.00000000000001 },
} satisfies ToolExample<LdmosDriftResistanceInput, LdmosDriftResistanceOutput>;

export const tool = createSimpleTool({
  id: "semiconductor/ldmos-drift-resistance",
  title: "LDMOS Drift Resistance",
  description:
    "Ohmic drift-region resistance of an LDMOS from effective resistivity and a rectangular current path.",
  inputs: [
    {
      id: "resistivityOhmMeters",
      kind: "number",
      label: "Resistivity Ohm Meters",
      unit: "Ω·m",
      minimum: 0,
    },
    {
      id: "driftLengthMeters",
      kind: "number",
      label: "Drift Length Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "pathWidthMeters",
      kind: "number",
      label: "Path Width Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "pathThicknessMeters",
      kind: "number",
      label: "Path Thickness Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "driftOhms", kind: "number", label: "Drift Ohms", unit: "Ω" },
  ],
  calculate: (input) =>
    calculateLdmosDriftResistance({
      resistivityOhmMeters: input.resistivityOhmMeters as number,
      driftLengthMeters: input.driftLengthMeters as number,
      pathWidthMeters: input.pathWidthMeters as number,
      pathThicknessMeters: input.pathThicknessMeters as number,
    }),
});
export const ldmosDriftResistanceTool = tool;
export const runLdmosDriftResistance = tool.execute;
export default tool;

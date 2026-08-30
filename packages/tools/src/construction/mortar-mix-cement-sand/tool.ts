import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MortarMixCementSandInput = Readonly<{
  readonly dryVolumeM3: number;
  readonly cementParts: number;
  readonly sandParts: number;
}>;
export type MortarMixCementSandOutput = Readonly<{
  readonly cementVolumeM3: number;
  readonly sandVolumeM3: number;
}>;

export const calculateMortarMixCementSand = (
  x: MortarMixCementSandInput,
): MortarMixCementSandOutput => {
  if (!Number.isFinite(x.dryVolumeM3) || x.dryVolumeM3 < 0)
    simpleError("dryVolumeM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.cementParts) || x.cementParts < 0)
    simpleError("cementParts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.sandParts) || x.sandParts < 0)
    simpleError("sandParts", "Provide a finite number at least 0.");
  if (!(x.cementParts > 0 && x.sandParts > 0))
    simpleError("cementParts", "Both mix-ratio parts must be positive.");
  const cementVolumeM3 =
    (x.dryVolumeM3 * x.cementParts) / (x.cementParts + x.sandParts);
  if (!Number.isFinite(cementVolumeM3))
    simpleError("cementVolumeM3", "The inputs produce an invalid result.");
  const sandVolumeM3 =
    (x.dryVolumeM3 * x.sandParts) / (x.cementParts + x.sandParts);
  if (!Number.isFinite(sandVolumeM3))
    simpleError("sandVolumeM3", "The inputs produce an invalid result.");
  return {
    cementVolumeM3: Object.is(cementVolumeM3, -0) ? 0 : cementVolumeM3,
    sandVolumeM3: Object.is(sandVolumeM3, -0) ? 0 : sandVolumeM3,
  };
};

export const example = {
  input: { dryVolumeM3: 1, cementParts: 1, sandParts: 3 },
  output: { cementVolumeM3: 0.25, sandVolumeM3: 0.75 },
} satisfies ToolExample<MortarMixCementSandInput, MortarMixCementSandOutput>;

export const tool = createSimpleTool({
  id: "construction/mortar-mix-cement-sand",
  title: "Mortar Mix Cement Sand",
  description:
    "Split total dry ingredient volume into cement and sand using a by-volume cement-to-sand parts ratio; excludes bulking and yield adjustments.",
  inputs: [
    {
      id: "dryVolumeM3",
      kind: "number",
      label: "Total dry ingredient volume",
      unit: "m³",
      minimum: 0,
    },
    { id: "cementParts", kind: "number", label: "Cement parts", minimum: 0 },
    { id: "sandParts", kind: "number", label: "Sand parts", minimum: 0 },
  ],
  outputs: [
    {
      id: "cementVolumeM3",
      kind: "number",
      label: "Cement volume",
      unit: "m³",
    },
    { id: "sandVolumeM3", kind: "number", label: "Sand volume", unit: "m³" },
  ],
  calculate: (input) =>
    calculateMortarMixCementSand({
      dryVolumeM3: input.dryVolumeM3 as number,
      cementParts: input.cementParts as number,
      sandParts: input.sandParts as number,
    }),
});
export const mortarMixCementSandTool = tool;
export const runMortarMixCementSand = tool.execute;
export default tool;

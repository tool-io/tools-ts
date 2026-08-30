import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FilletWeldStrengthInput = Readonly<{
  readonly effectiveThroatMillimeters: number;
  readonly weldLengthMillimeters: number;
  readonly allowableShearMegapascals: number;
}>;
export type FilletWeldStrengthOutput = Readonly<{
  readonly allowableForceNewtons: number;
}>;

export const calculateFilletWeldStrength = (
  x: FilletWeldStrengthInput,
): FilletWeldStrengthOutput => {
  if (
    !Number.isFinite(x.effectiveThroatMillimeters) ||
    x.effectiveThroatMillimeters < 0
  )
    simpleError(
      "effectiveThroatMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.weldLengthMillimeters) || x.weldLengthMillimeters < 0)
    simpleError("weldLengthMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.allowableShearMegapascals) ||
    x.allowableShearMegapascals < 0
  )
    simpleError(
      "allowableShearMegapascals",
      "Provide a finite number at least 0.",
    );
  const allowableForceNewtons =
    x.effectiveThroatMillimeters *
    x.weldLengthMillimeters *
    x.allowableShearMegapascals;
  if (!Number.isFinite(allowableForceNewtons))
    simpleError(
      "allowableForceNewtons",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    allowableForceNewtons: Object.is(allowableForceNewtons, -0)
      ? 0
      : allowableForceNewtons,
  };
};

export const example = {
  input: {
    effectiveThroatMillimeters: 3,
    weldLengthMillimeters: 100,
    allowableShearMegapascals: 100,
  },
  output: { allowableForceNewtons: 30000 },
} satisfies ToolExample<FilletWeldStrengthInput, FilletWeldStrengthOutput>;

export const tool = createSimpleTool({
  id: "engineering/fillet-weld-strength",
  title: "Fillet Weld Strength",
  description:
    "Idealized fillet weld force from effective throat area and a supplied allowable throat shear stress; excludes code factors.",
  inputs: [
    {
      id: "effectiveThroatMillimeters",
      kind: "number",
      label: "Effective Throat Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "weldLengthMillimeters",
      kind: "number",
      label: "Weld Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "allowableShearMegapascals",
      kind: "number",
      label: "Allowable Shear Megapascals",
      unit: "MPa",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "allowableForceNewtons",
      kind: "number",
      label: "Allowable Force Newtons",
      unit: "N",
    },
  ],
  calculate: (input) =>
    calculateFilletWeldStrength({
      effectiveThroatMillimeters: input.effectiveThroatMillimeters as number,
      weldLengthMillimeters: input.weldLengthMillimeters as number,
      allowableShearMegapascals: input.allowableShearMegapascals as number,
    }),
});
export const filletWeldStrengthTool = tool;
export const runFilletWeldStrength = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SchleifpapierVerbrauchQmProPlatteInput = Readonly<{
  readonly panelAreaSquareMeters: number;
  readonly usableAreaPerSheetSquareMeters: number;
}>;
export type SchleifpapierVerbrauchQmProPlatteOutput = Readonly<{
  readonly sheetCount: number;
}>;

export const calculateSchleifpapierVerbrauchQmProPlatte = (
  x: SchleifpapierVerbrauchQmProPlatteInput,
): SchleifpapierVerbrauchQmProPlatteOutput => {
  if (!Number.isFinite(x.panelAreaSquareMeters) || x.panelAreaSquareMeters < 0)
    simpleError("panelAreaSquareMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.usableAreaPerSheetSquareMeters) ||
    x.usableAreaPerSheetSquareMeters < 0
  )
    simpleError(
      "usableAreaPerSheetSquareMeters",
      "Provide a finite number at least 0.",
    );
  const sheetCount = Math.ceil(
    x.panelAreaSquareMeters / x.usableAreaPerSheetSquareMeters,
  );
  if (!Number.isFinite(sheetCount) || !Number.isSafeInteger(sheetCount))
    simpleError(
      "sheetCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { sheetCount: Object.is(sheetCount, -0) ? 0 : sheetCount };
};

export const example = {
  input: { panelAreaSquareMeters: 10, usableAreaPerSheetSquareMeters: 2 },
  output: { sheetCount: 5 },
} satisfies ToolExample<
  SchleifpapierVerbrauchQmProPlatteInput,
  SchleifpapierVerbrauchQmProPlatteOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/schleifpapier-verbrauch-qm-pro-platte",
  title: "Schleifpapier Verbrauch Qm Pro Platte",
  description:
    "Sandpaper sheets required to sand a specified total panel area using an observed effective area per sheet.",
  inputs: [
    {
      id: "panelAreaSquareMeters",
      kind: "number",
      label: "Panel Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "usableAreaPerSheetSquareMeters",
      kind: "number",
      label: "Usable Area Per Sheet Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [{ id: "sheetCount", kind: "integer", label: "Sheet Count" }],
  calculate: (input) =>
    calculateSchleifpapierVerbrauchQmProPlatte({
      panelAreaSquareMeters: input.panelAreaSquareMeters as number,
      usableAreaPerSheetSquareMeters:
        input.usableAreaPerSheetSquareMeters as number,
    }),
});
export const schleifpapierVerbrauchQmProPlatteTool = tool;
export const runSchleifpapierVerbrauchQmProPlatte = tool.execute;
export default tool;

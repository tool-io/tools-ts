import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TuerBlattUeberfaltungInput = Readonly<{
  readonly leafWidthMillimeters: number;
  readonly clearOpeningMillimeters: number;
}>;
export type TuerBlattUeberfaltungOutput = Readonly<{
  readonly overlayEachSideMillimeters: number;
}>;

export const calculateTuerBlattUeberfaltung = (
  x: TuerBlattUeberfaltungInput,
): TuerBlattUeberfaltungOutput => {
  if (!Number.isFinite(x.leafWidthMillimeters) || x.leafWidthMillimeters < 0)
    simpleError("leafWidthMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.clearOpeningMillimeters) ||
    x.clearOpeningMillimeters < 0
  )
    simpleError(
      "clearOpeningMillimeters",
      "Provide a finite number at least 0.",
    );
  if (x.leafWidthMillimeters < x.clearOpeningMillimeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const overlayEachSideMillimeters =
    (x.leafWidthMillimeters - x.clearOpeningMillimeters) / 2;
  if (!Number.isFinite(overlayEachSideMillimeters))
    simpleError(
      "overlayEachSideMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    overlayEachSideMillimeters: Object.is(overlayEachSideMillimeters, -0)
      ? 0
      : overlayEachSideMillimeters,
  };
};

export const example = {
  input: { leafWidthMillimeters: 800, clearOpeningMillimeters: 760 },
  output: { overlayEachSideMillimeters: 20 },
} satisfies ToolExample<
  TuerBlattUeberfaltungInput,
  TuerBlattUeberfaltungOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/tuer-blatt-ueberfaltung",
  title: "Tuer Blatt Ueberfaltung",
  description:
    "Equal side overlay of a centered door leaf over a narrower clear opening, based on measured leaf and opening widths.",
  inputs: [
    {
      id: "leafWidthMillimeters",
      kind: "number",
      label: "Leaf Width Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "clearOpeningMillimeters",
      kind: "number",
      label: "Clear Opening Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "overlayEachSideMillimeters",
      kind: "number",
      label: "Overlay Each Side Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateTuerBlattUeberfaltung({
      leafWidthMillimeters: input.leafWidthMillimeters as number,
      clearOpeningMillimeters: input.clearOpeningMillimeters as number,
    }),
});
export const tuerBlattUeberfaltungTool = tool;
export const runTuerBlattUeberfaltung = tool.execute;
export default tool;

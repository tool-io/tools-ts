import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SockelfussAnzahlInput = Readonly<{
  readonly cabinetLengthMillimeters: number;
  readonly maxSpacingMillimeters: number;
}>;
export type SockelfussAnzahlOutput = Readonly<{
  readonly footCount: number;
}>;

export const calculateSockelfussAnzahl = (
  x: SockelfussAnzahlInput,
): SockelfussAnzahlOutput => {
  if (
    !Number.isFinite(x.cabinetLengthMillimeters) ||
    x.cabinetLengthMillimeters < 0
  )
    simpleError(
      "cabinetLengthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.maxSpacingMillimeters) || x.maxSpacingMillimeters < 0)
    simpleError("maxSpacingMillimeters", "Provide a finite number at least 0.");
  if (x.cabinetLengthMillimeters <= 0 || x.maxSpacingMillimeters <= 0)
    simpleError(
      "input",
      "Cabinet length and maximum foot spacing must be positive.",
    );
  const footCount =
    2 * (Math.ceil(x.cabinetLengthMillimeters / x.maxSpacingMillimeters) + 1);
  if (!Number.isFinite(footCount) || !Number.isSafeInteger(footCount))
    simpleError(
      "footCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { footCount: Object.is(footCount, -0) ? 0 : footCount };
};

export const example = {
  input: { cabinetLengthMillimeters: 1200, maxSpacingMillimeters: 600 },
  output: { footCount: 6 },
} satisfies ToolExample<SockelfussAnzahlInput, SockelfussAnzahlOutput>;

export const tool = createSimpleTool({
  id: "carpentry/sockelfuss-anzahl",
  title: "Sockelfuss Anzahl",
  description:
    "Minimum number of plinth feet for two straight front and rear rows under a cabinet, using a chosen maximum spacing; excludes load-rating checks.",
  inputs: [
    {
      id: "cabinetLengthMillimeters",
      kind: "number",
      label: "Cabinet Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "maxSpacingMillimeters",
      kind: "number",
      label: "Max Spacing Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [{ id: "footCount", kind: "integer", label: "Foot Count" }],
  calculate: (input) =>
    calculateSockelfussAnzahl({
      cabinetLengthMillimeters: input.cabinetLengthMillimeters as number,
      maxSpacingMillimeters: input.maxSpacingMillimeters as number,
    }),
});
export const sockelfussAnzahlTool = tool;
export const runSockelfussAnzahl = tool.execute;
export default tool;

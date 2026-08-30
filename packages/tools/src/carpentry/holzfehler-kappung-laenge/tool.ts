import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HolzfehlerKappungLaengeInput = Readonly<{
  readonly boardLengthMm: number;
  readonly defectLengthMm: number;
  readonly kerfAllowanceMm: number;
}>;
export type HolzfehlerKappungLaengeOutput = Readonly<{
  readonly usableLengthMm: number;
}>;

export const calculateHolzfehlerKappungLaenge = (
  x: HolzfehlerKappungLaengeInput,
): HolzfehlerKappungLaengeOutput => {
  if (!Number.isFinite(x.boardLengthMm) || x.boardLengthMm < 0)
    simpleError("boardLengthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.defectLengthMm) || x.defectLengthMm < 0)
    simpleError("defectLengthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.kerfAllowanceMm) || x.kerfAllowanceMm < 0)
    simpleError("kerfAllowanceMm", "Provide a finite number at least 0.");
  if (x.defectLengthMm + x.kerfAllowanceMm > x.boardLengthMm)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const usableLengthMm = x.boardLengthMm - x.defectLengthMm - x.kerfAllowanceMm;
  if (!Number.isFinite(usableLengthMm))
    simpleError(
      "usableLengthMm",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { usableLengthMm: Object.is(usableLengthMm, -0) ? 0 : usableLengthMm };
};

export const example = {
  input: { boardLengthMm: 2000, defectLengthMm: 100, kerfAllowanceMm: 6 },
  output: { usableLengthMm: 1894 },
} satisfies ToolExample<
  HolzfehlerKappungLaengeInput,
  HolzfehlerKappungLaengeOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/holzfehler-kappung-laenge",
  title: "Holzfehler Kappung Laenge",
  description:
    "Remaining usable board length after cutting away a measured defect segment and a specified saw-kerf allowance.",
  inputs: [
    {
      id: "boardLengthMm",
      kind: "number",
      label: "Board Length Mm",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "defectLengthMm",
      kind: "number",
      label: "Defect Length Mm",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "kerfAllowanceMm",
      kind: "number",
      label: "Kerf Allowance Mm",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "usableLengthMm",
      kind: "number",
      label: "Usable Length Mm",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateHolzfehlerKappungLaenge({
      boardLengthMm: input.boardLengthMm as number,
      defectLengthMm: input.defectLengthMm as number,
      kerfAllowanceMm: input.kerfAllowanceMm as number,
    }),
});
export const holzfehlerKappungLaengeTool = tool;
export const runHolzfehlerKappungLaenge = tool.execute;
export default tool;

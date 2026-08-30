import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EinlegebodenBohrungenAnzahlProHoeheInput = Readonly<{
  readonly firstCenterMm: number;
  readonly lastCenterMm: number;
  readonly spacingMm: number;
}>;
export type EinlegebodenBohrungenAnzahlProHoeheOutput = Readonly<{
  readonly holeCount: number;
}>;

export const calculateEinlegebodenBohrungenAnzahlProHoehe = (
  x: EinlegebodenBohrungenAnzahlProHoeheInput,
): EinlegebodenBohrungenAnzahlProHoeheOutput => {
  if (!Number.isFinite(x.firstCenterMm) || x.firstCenterMm < 0)
    simpleError("firstCenterMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lastCenterMm) || x.lastCenterMm < 0)
    simpleError("lastCenterMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.spacingMm) || x.spacingMm < 0)
    simpleError("spacingMm", "Provide a finite number at least 0.");
  if (x.lastCenterMm < x.firstCenterMm)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const holeCount =
    Math.floor((x.lastCenterMm - x.firstCenterMm) / x.spacingMm) + 1;
  if (!Number.isFinite(holeCount) || !Number.isSafeInteger(holeCount))
    simpleError(
      "holeCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { holeCount: Object.is(holeCount, -0) ? 0 : holeCount };
};

export const example = {
  input: { firstCenterMm: 32, lastCenterMm: 352, spacingMm: 32 },
  output: { holeCount: 11 },
} satisfies ToolExample<
  EinlegebodenBohrungenAnzahlProHoeheInput,
  EinlegebodenBohrungenAnzahlProHoeheOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/einlegeboden-bohrungen-anzahl-pro-hoehe",
  title: "Einlegeboden Bohrungen Anzahl Pro Hoehe",
  description:
    "Count shelf-pin holes on one vertical row between a first and last usable center, inclusive, at a chosen center spacing.",
  inputs: [
    {
      id: "firstCenterMm",
      kind: "number",
      label: "First Center Mm",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "lastCenterMm",
      kind: "number",
      label: "Last Center Mm",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "spacingMm",
      kind: "number",
      label: "Spacing Mm",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [{ id: "holeCount", kind: "integer", label: "Hole Count" }],
  calculate: (input) =>
    calculateEinlegebodenBohrungenAnzahlProHoehe({
      firstCenterMm: input.firstCenterMm as number,
      lastCenterMm: input.lastCenterMm as number,
      spacingMm: input.spacingMm as number,
    }),
});
export const einlegebodenBohrungenAnzahlProHoeheTool = tool;
export const runEinlegebodenBohrungenAnzahlProHoehe = tool.execute;
export default tool;

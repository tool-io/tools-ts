import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ArbeitsplatteStossfuge5mmInput = Readonly<{
  readonly availableRunMm: number;
}>;
export type ArbeitsplatteStossfuge5mmOutput = Readonly<{
  readonly usableRunMm: number;
}>;

export const calculateArbeitsplatteStossfuge5mm = (
  x: ArbeitsplatteStossfuge5mmInput,
): ArbeitsplatteStossfuge5mmOutput => {
  if (!Number.isFinite(x.availableRunMm) || x.availableRunMm < 0)
    simpleError("availableRunMm", "Provide a finite number at least 0.");
  if (x.availableRunMm <= 5)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const usableRunMm = x.availableRunMm - 5;
  if (!Number.isFinite(usableRunMm))
    simpleError(
      "usableRunMm",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { usableRunMm: Object.is(usableRunMm, -0) ? 0 : usableRunMm };
};

export const example = {
  input: { availableRunMm: 1000 },
  output: { usableRunMm: 995 },
} satisfies ToolExample<
  ArbeitsplatteStossfuge5mmInput,
  ArbeitsplatteStossfuge5mmOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/arbeitsplatte-stossfuge-5mm",
  title: "Arbeitsplatte Stossfuge 5mm",
  description:
    "Remaining countertop run after reserving a 5 mm movement gap at a butt joint; check finish and sealant requirements separately.",
  inputs: [
    {
      id: "availableRunMm",
      kind: "number",
      label: "Available Run Mm",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "usableRunMm", kind: "number", label: "Usable Run Mm", unit: "mm" },
  ],
  calculate: (input) =>
    calculateArbeitsplatteStossfuge5mm({
      availableRunMm: input.availableRunMm as number,
    }),
});
export const arbeitsplatteStossfuge5mmTool = tool;
export const runArbeitsplatteStossfuge5mm = tool.execute;
export default tool;

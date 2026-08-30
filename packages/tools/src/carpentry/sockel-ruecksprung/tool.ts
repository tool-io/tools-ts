import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SockelRuecksprungInput = Readonly<{
  readonly cabinetFrontMillimeters: number;
  readonly plinthFrontMillimeters: number;
}>;
export type SockelRuecksprungOutput = Readonly<{
  readonly recessMillimeters: number;
}>;

export const calculateSockelRuecksprung = (
  x: SockelRuecksprungInput,
): SockelRuecksprungOutput => {
  if (
    !Number.isFinite(x.cabinetFrontMillimeters) ||
    x.cabinetFrontMillimeters < 0
  )
    simpleError(
      "cabinetFrontMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.plinthFrontMillimeters) ||
    x.plinthFrontMillimeters < 0
  )
    simpleError(
      "plinthFrontMillimeters",
      "Provide a finite number at least 0.",
    );
  if (x.plinthFrontMillimeters > x.cabinetFrontMillimeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const recessMillimeters =
    x.cabinetFrontMillimeters - x.plinthFrontMillimeters;
  if (!Number.isFinite(recessMillimeters))
    simpleError(
      "recessMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    recessMillimeters: Object.is(recessMillimeters, -0) ? 0 : recessMillimeters,
  };
};

export const example = {
  input: { cabinetFrontMillimeters: 600, plinthFrontMillimeters: 550 },
  output: { recessMillimeters: 50 },
} satisfies ToolExample<SockelRuecksprungInput, SockelRuecksprungOutput>;

export const tool = createSimpleTool({
  id: "carpentry/sockel-ruecksprung",
  title: "Sockel Ruecksprung",
  description:
    "Toe-kick recess from cabinet front plane to plinth front plane, both measured from the same rear datum.",
  inputs: [
    {
      id: "cabinetFrontMillimeters",
      kind: "number",
      label: "Cabinet Front Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "plinthFrontMillimeters",
      kind: "number",
      label: "Plinth Front Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "recessMillimeters",
      kind: "number",
      label: "Recess Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateSockelRuecksprung({
      cabinetFrontMillimeters: input.cabinetFrontMillimeters as number,
      plinthFrontMillimeters: input.plinthFrontMillimeters as number,
    }),
});
export const sockelRuecksprungTool = tool;
export const runSockelRuecksprung = tool.execute;
export default tool;

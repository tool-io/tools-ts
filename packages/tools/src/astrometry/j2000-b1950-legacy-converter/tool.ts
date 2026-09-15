import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  angle,
  legacyFrame,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly rightAscensionDegrees: number;
  readonly declinationDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "rightAscensionDegrees",
    label: "Right ascension degrees",
    kind: "number",
  },
  { id: "declinationDegrees", label: "Declination degrees", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  angle(i.rightAscensionDegrees, "RA", 0, 360);
  angle(i.declinationDegrees, "Dec", -90, 90);
  return legacyFrame(i.rightAscensionDegrees, i.declinationDegrees, true);
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { rightAscensionDegrees: 0, declinationDegrees: 0 },
  output: {
    result: {
      approximateRightAscensionDegrees: 359.3592941796932,
      approximateDeclinationDegrees: -0.27834099509480886,
      fullFk4Fk5ConversionApplied: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/j2000-b1950-legacy-converter",
  title: "J2000 to B1950 Besselian Coordinate Legacy Converter",
  description:
    "Static approximate J2000-to-B1950 orientation-only rotation using conventional matrix; E-terms, proper motion, epoch propagation and FK4/FK5 catalog conversion omitted explicitly.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

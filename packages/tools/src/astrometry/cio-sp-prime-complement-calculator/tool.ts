import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, angle } from "../batch52-shared.js";
export type Input = Readonly<{ readonly ttJulianCenturiesFromJ2000: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "ttJulianCenturiesFromJ2000",
    label: "Tt julian centuries from j2000",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  angle(i.ttJulianCenturiesFromJ2000, "centuries", -10, 10);
  return {
    approximateTerrestrialSpMicroarcsec: -47 * i.ttJulianCenturiesFromJ2000,
    celestialCioLocatorComputed: false,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { ttJulianCenturiesFromJ2000: 1 },
  output: {
    result: {
      approximateTerrestrialSpMicroarcsec: -47,
      celestialCioLocatorComputed: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/cio-sp-prime-complement-calculator",
  title:
    "CIO Locator Celestial Intermediate Pole s-prime Complement Calculator",
  description:
    "IERS approximate terrestrial TIO locator s-prime=-47 microarcsec*T; distinguishes it from celestial CIO locator s, which is not computed.",
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

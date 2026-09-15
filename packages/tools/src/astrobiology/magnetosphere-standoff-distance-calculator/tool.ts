import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly dipoleMomentAm2: number;
  readonly externalPressurePa: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "dipoleMomentAm2", label: "Dipole moment am2", kind: "number" },
  { id: "externalPressurePa", label: "External pressure pa", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.dipoleMomentAm2, "dipole");
  positive(i.externalPressurePa, "pressure");
  return {
    equatorialPressureBalanceRadiusM:
      ((1.25663706212e-6 * i.dipoleMomentAm2 ** 2) /
        (32 * Math.PI ** 2 * i.externalPressurePa)) **
      (1 / 6),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { dipoleMomentAm2: 1e20, externalPressurePa: 1e-9 },
  output: { result: { equatorialPressureBalanceRadiusM: 5842876.275342443 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/magnetosphere-standoff-distance-calculator",
  title: "Magnetosphere Standoff Distance Solar Wind Pressure Calculator",
  description:
    "Equatorial vacuum dipole magnetic-pressure balance radius; no magnetopause enhancement, reconnection/tilt or space-weather safety forecast.",
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

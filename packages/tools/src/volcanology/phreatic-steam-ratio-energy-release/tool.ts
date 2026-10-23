import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly waterMassKg: number;
  readonly flashedSteamFraction: number;
  readonly callerEnthalpyReleaseJPerKg: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "waterMassKg", label: "Water mass kg", kind: "number" },
  {
    id: "flashedSteamFraction",
    label: "Flashed steam fraction",
    kind: "number",
  },
  {
    id: "callerEnthalpyReleaseJPerKg",
    label: "Caller enthalpy release j per kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.waterMassKg, "mass");
  fraction(i.flashedSteamFraction, "fraction");
  nonnegative(i.callerEnthalpyReleaseJPerKg, "enthalpy");
  return {
    conditionalEnergyJ:
      i.waterMassKg * i.flashedSteamFraction * i.callerEnthalpyReleaseJPerKg,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    waterMassKg: 10,
    flashedSteamFraction: 0.5,
    callerEnthalpyReleaseJPerKg: 2000,
  },
  output: { result: { conditionalEnergyJ: 10000 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/phreatic-steam-ratio-energy-release",
  title: "Phreatic Steam Ratio Energy Release Calculator",
  description:
    "Conditional flashed steam energy budget from independently established thermodynamic enthalpy release; no pressure/phase solver or blast range.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalEnergyJ: { type: "number" } },
        required: ["conditionalEnergyJ"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

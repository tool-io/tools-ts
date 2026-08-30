import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LnaInputIp3Input = Readonly<{
  readonly inputToneDbm: number;
  readonly fundamentalOutputDbm: number;
  readonly thirdOrderOutputDbm: number;
}>;
export type LnaInputIp3Output = Readonly<{
  readonly inputIp3Dbm: number;
}>;

export const calculateLnaInputIp3 = (
  x: LnaInputIp3Input,
): LnaInputIp3Output => {
  if (!Number.isFinite(x.inputToneDbm))
    simpleError("inputToneDbm", "Provide a finite number.");
  if (!Number.isFinite(x.fundamentalOutputDbm))
    simpleError("fundamentalOutputDbm", "Provide a finite number.");
  if (!Number.isFinite(x.thirdOrderOutputDbm))
    simpleError("thirdOrderOutputDbm", "Provide a finite number.");
  if (x.thirdOrderOutputDbm >= x.fundamentalOutputDbm)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const inputIp3Dbm =
    x.inputToneDbm + (x.fundamentalOutputDbm - x.thirdOrderOutputDbm) / 2;
  if (!Number.isFinite(inputIp3Dbm))
    simpleError(
      "inputIp3Dbm",
      "Inputs produce an undefined or non-finite result.",
    );
  return { inputIp3Dbm: Object.is(inputIp3Dbm, -0) ? 0 : inputIp3Dbm };
};

export const example = {
  input: {
    inputToneDbm: -30,
    fundamentalOutputDbm: -10,
    thirdOrderOutputDbm: -50,
  },
  output: { inputIp3Dbm: -10 },
} satisfies ToolExample<LnaInputIp3Input, LnaInputIp3Output>;

export const tool = createSimpleTool({
  id: "electronics/lna-input-ip3",
  title: "LNA Input IP3",
  description:
    "LNA input third-order intercept extrapolated from two-tone fundamental and third-order intermodulation levels.",
  inputs: [
    {
      id: "inputToneDbm",
      kind: "number",
      label: "Input Tone Dbm",
      unit: "dBm",
    },
    {
      id: "fundamentalOutputDbm",
      kind: "number",
      label: "Fundamental Output Dbm",
      unit: "dBm",
    },
    {
      id: "thirdOrderOutputDbm",
      kind: "number",
      label: "Third Order Output Dbm",
      unit: "dBm",
    },
  ],
  outputs: [
    { id: "inputIp3Dbm", kind: "number", label: "Input Ip3 Dbm", unit: "dBm" },
  ],
  calculate: (input) =>
    calculateLnaInputIp3({
      inputToneDbm: input.inputToneDbm as number,
      fundamentalOutputDbm: input.fundamentalOutputDbm as number,
      thirdOrderOutputDbm: input.thirdOrderOutputDbm as number,
    }),
});
export const lnaInputIp3Tool = tool;
export const runLnaInputIp3 = tool.execute;
export default tool;

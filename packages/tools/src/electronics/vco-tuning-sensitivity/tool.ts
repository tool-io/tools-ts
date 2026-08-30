import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VcoTuningSensitivityInput = Readonly<{
  readonly firstHertz: number;
  readonly secondHertz: number;
  readonly firstVolts: number;
  readonly secondVolts: number;
}>;
export type VcoTuningSensitivityOutput = Readonly<{
  readonly hertzPerVolt: number;
}>;

export const calculateVcoTuningSensitivity = (
  x: VcoTuningSensitivityInput,
): VcoTuningSensitivityOutput => {
  if (!Number.isFinite(x.firstHertz) || x.firstHertz < 0)
    simpleError("firstHertz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.secondHertz) || x.secondHertz < 0)
    simpleError("secondHertz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.firstVolts))
    simpleError("firstVolts", "Provide a finite number.");
  if (!Number.isFinite(x.secondVolts))
    simpleError("secondVolts", "Provide a finite number.");
  const hertzPerVolt =
    (x.secondHertz - x.firstHertz) / (x.secondVolts - x.firstVolts);
  if (!Number.isFinite(hertzPerVolt))
    simpleError(
      "hertzPerVolt",
      "Inputs produce an undefined or non-finite result.",
    );
  return { hertzPerVolt: Object.is(hertzPerVolt, -0) ? 0 : hertzPerVolt };
};

export const example = {
  input: {
    firstHertz: 1000000,
    secondHertz: 2000000,
    firstVolts: 1,
    secondVolts: 2,
  },
  output: { hertzPerVolt: 1000000 },
} satisfies ToolExample<VcoTuningSensitivityInput, VcoTuningSensitivityOutput>;

export const tool = createSimpleTool({
  id: "electronics/vco-tuning-sensitivity",
  title: "VCO Tuning Sensitivity",
  description:
    "Average VCO frequency tuning sensitivity between two measured voltage-frequency operating points.",
  inputs: [
    {
      id: "firstHertz",
      kind: "number",
      label: "First Hertz",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "secondHertz",
      kind: "number",
      label: "Second Hertz",
      unit: "Hz",
      minimum: 0,
    },
    { id: "firstVolts", kind: "number", label: "First Volts", unit: "V" },
    { id: "secondVolts", kind: "number", label: "Second Volts", unit: "V" },
  ],
  outputs: [
    {
      id: "hertzPerVolt",
      kind: "number",
      label: "Hertz Per Volt",
      unit: "Hz/V",
    },
  ],
  calculate: (input) =>
    calculateVcoTuningSensitivity({
      firstHertz: input.firstHertz as number,
      secondHertz: input.secondHertz as number,
      firstVolts: input.firstVolts as number,
      secondVolts: input.secondVolts as number,
    }),
});
export const vcoTuningSensitivityTool = tool;
export const runVcoTuningSensitivity = tool.execute;
export default tool;

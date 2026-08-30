import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeadphoneSensitivityDbInput = Readonly<{
  readonly sensitivityDbSplPerMilliwatt: number;
  readonly nominalImpedanceOhms: number;
}>;
export type HeadphoneSensitivityDbOutput = Readonly<{
  readonly sensitivityDbSplPerVolt: number;
}>;

export const calculateHeadphoneSensitivityDb = (
  x: HeadphoneSensitivityDbInput,
): HeadphoneSensitivityDbOutput => {
  if (!Number.isFinite(x.sensitivityDbSplPerMilliwatt))
    simpleError("sensitivityDbSplPerMilliwatt", "Provide a finite number.");
  if (!Number.isFinite(x.nominalImpedanceOhms) || x.nominalImpedanceOhms < 0)
    simpleError("nominalImpedanceOhms", "Provide a finite number at least 0.");
  const sensitivityDbSplPerVolt =
    x.sensitivityDbSplPerMilliwatt +
    10 * Math.log10(1000 / x.nominalImpedanceOhms);
  if (!Number.isFinite(sensitivityDbSplPerVolt))
    simpleError(
      "sensitivityDbSplPerVolt",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    sensitivityDbSplPerVolt: Object.is(sensitivityDbSplPerVolt, -0)
      ? 0
      : sensitivityDbSplPerVolt,
  };
};

export const example = {
  input: { sensitivityDbSplPerMilliwatt: 100, nominalImpedanceOhms: 32 },
  output: { sensitivityDbSplPerVolt: 114.94850021680094 },
} satisfies ToolExample<
  HeadphoneSensitivityDbInput,
  HeadphoneSensitivityDbOutput
>;

export const tool = createSimpleTool({
  id: "electronics/headphone-sensitivity-db",
  title: "Headphone Sensitivity DB",
  description:
    "Convert headphone sensitivity from dB SPL at 1 mW to dB SPL at 1 V RMS using nominal resistive impedance.",
  inputs: [
    {
      id: "sensitivityDbSplPerMilliwatt",
      kind: "number",
      label: "Sensitivity Db Spl Per Milliwatt",
      unit: "dB SPL/mW",
    },
    {
      id: "nominalImpedanceOhms",
      kind: "number",
      label: "Nominal Impedance Ohms",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "sensitivityDbSplPerVolt",
      kind: "number",
      label: "Sensitivity Db Spl Per Volt",
      unit: "dB SPL/V",
    },
  ],
  calculate: (input) =>
    calculateHeadphoneSensitivityDb({
      sensitivityDbSplPerMilliwatt:
        input.sensitivityDbSplPerMilliwatt as number,
      nominalImpedanceOhms: input.nominalImpedanceOhms as number,
    }),
});
export const headphoneSensitivityDbTool = tool;
export const runHeadphoneSensitivityDb = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SiliconValleySplittingInput = {
  readonly interfaceElectricFieldMVPerM: number;
  readonly fieldSlopeMicroEvPerMVPerM: number;
  readonly zeroFieldSplittingMicroEv: number;
};

export type SiliconValleySplittingOutput = {
  readonly splittingMicroEv: number;
};

export const siliconValleySplittingExample = {
  input: {
    fieldSlopeMicroEvPerMVPerM: 3,
    interfaceElectricFieldMVPerM: 10,
    zeroFieldSplittingMicroEv: 20,
  },
  output: { splittingMicroEv: 50 },
} satisfies ToolExample<
  SiliconValleySplittingInput,
  SiliconValleySplittingOutput
>;

export const siliconValleySplittingTool = createSimpleTool({
  id: "semiconductor/valley-splitting-silicon",
  title: "Silicon Valley Splitting Calculator",
  description:
    "Estimate silicon interface valley splitting from a device-calibrated linear dependence on vertical electric field.",
  inputs: [
    {
      description:
        "Magnitude of the vertical electric field at the silicon interface.",
      id: "interfaceElectricFieldMVPerM",
      kind: "number",
      label: "Interface electric field",
      minimum: 0,
      unit: "MV/m",
    },
    {
      description:
        "Measured zero-field intercept for this device and interface.",
      id: "zeroFieldSplittingMicroEv",
      kind: "number",
      label: "Zero-field splitting",
      minimum: 0,
      unit: "ueV",
    },
    {
      description: "Measured increase in splitting per MV/m of vertical field.",
      id: "fieldSlopeMicroEvPerMVPerM",
      kind: "number",
      label: "Electric-field slope",
      minimum: 0,
      unit: "ueV/(MV/m)",
    },
  ],
  outputs: [
    {
      description: "Energy splitting between the lowest silicon valleys.",
      format: "energy-ueV",
      id: "splittingMicroEv",
      kind: "number",
      label: "Valley splitting",
      unit: "ueV",
    },
  ],
  calculate: (input) => {
    const splittingMicroEv =
      (input.zeroFieldSplittingMicroEv as number) +
      (input.fieldSlopeMicroEvPerMVPerM as number) *
        (input.interfaceElectricFieldMVPerM as number);
    if (!Number.isFinite(splittingMicroEv))
      simpleError(
        "interfaceElectricFieldMVPerM",
        "Calculated splitting is not finite.",
      );
    return { splittingMicroEv };
  },
});
export const runSiliconValleySplitting = siliconValleySplittingTool.execute;
export default siliconValleySplittingTool;

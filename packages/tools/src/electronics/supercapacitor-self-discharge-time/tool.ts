import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SupercapacitorSelfDischargeTimeInput = {
  readonly leakageTimeConstantHours: number;
  readonly vAcceptable: number;
  readonly vCharged: number;
};

export type SupercapacitorSelfDischargeTimeOutput = {
  readonly selfDischargeDays: number;
};

export const supercapacitorSelfDischargeTimeExample = {
  input: {
    leakageTimeConstantHours: 1200,
    vAcceptable: 1.35,
    vCharged: 2.7,
  },
  output: { selfDischargeDays: 34.657359027997266 },
} satisfies ToolExample<
  SupercapacitorSelfDischargeTimeInput,
  SupercapacitorSelfDischargeTimeOutput
>;

export const calculateSupercapacitorSelfDischargeTime = (
  input: SupercapacitorSelfDischargeTimeInput,
): SupercapacitorSelfDischargeTimeOutput => {
  if (!(input.leakageTimeConstantHours > 0))
    simpleError(
      "leakageTimeConstantHours",
      "Leakage time constant must be positive.",
      "invalid_time_constant",
    );
  if (!(input.vCharged > 0) || !(input.vAcceptable > 0))
    simpleError("vCharged", "Voltages must be positive.", "invalid_voltages");
  if (!(input.vCharged > input.vAcceptable))
    simpleError(
      "vCharged",
      "Charged voltage must exceed the acceptable voltage.",
      "invalid_voltages",
    );
  return {
    selfDischargeDays:
      (input.leakageTimeConstantHours *
        Math.log(input.vCharged / input.vAcceptable)) /
      24,
  };
};

export const supercapacitorSelfDischargeTimeTool = createSimpleTool({
  calculate: (input) =>
    calculateSupercapacitorSelfDischargeTime(
      input as unknown as SupercapacitorSelfDischargeTimeInput,
    ),
  description:
    "Estimate how long a supercapacitor takes to self-discharge from a charged voltage down to an acceptable voltage.",
  id: "electronics/supercapacitor-self-discharge-time",
  inputs: [
    {
      description: "RC leakage time constant of the supercapacitor in hours.",
      format: "time",
      id: "leakageTimeConstantHours",
      kind: "number",
      label: "Leakage time constant",
      unit: "h",
    },
    {
      description: "Fully charged voltage at the start of storage.",
      format: "voltage",
      id: "vCharged",
      kind: "number",
      label: "Charged voltage",
      unit: "V",
    },
    {
      description: "Lowest voltage the application still accepts.",
      format: "voltage",
      id: "vAcceptable",
      kind: "number",
      label: "Acceptable voltage",
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "Estimated days until the voltage decays to acceptable.",
      format: "duration",
      id: "selfDischargeDays",
      kind: "number",
      label: "Self-discharge time",
      unit: "days",
    },
  ],
  title: "Supercap Self-Discharge Time",
});
export const runSupercapacitorSelfDischargeTime =
  supercapacitorSelfDischargeTimeTool.execute;
export default supercapacitorSelfDischargeTimeTool;

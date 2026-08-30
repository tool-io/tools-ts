import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SupercapacitorSelfDischargeRateInput = Readonly<{
  readonly initialVolts: number;
  readonly finalVolts: number;
  readonly elapsedHours: number;
}>;
export type SupercapacitorSelfDischargeRateOutput = Readonly<{
  readonly voltsPerHour: number;
}>;

export const calculateSupercapacitorSelfDischargeRate = (
  x: SupercapacitorSelfDischargeRateInput,
): SupercapacitorSelfDischargeRateOutput => {
  if (!Number.isFinite(x.initialVolts) || x.initialVolts < 0)
    simpleError("initialVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.finalVolts) || x.finalVolts < 0)
    simpleError("finalVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.elapsedHours) || x.elapsedHours < 0)
    simpleError("elapsedHours", "Provide a finite number at least 0.");
  if (x.finalVolts > x.initialVolts)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const voltsPerHour = (x.initialVolts - x.finalVolts) / x.elapsedHours;
  if (!Number.isFinite(voltsPerHour))
    simpleError(
      "voltsPerHour",
      "Inputs produce an undefined or non-finite result.",
    );
  return { voltsPerHour: Object.is(voltsPerHour, -0) ? 0 : voltsPerHour };
};

export const example = {
  input: { initialVolts: 3, finalVolts: 2, elapsedHours: 10 },
  output: { voltsPerHour: 0.1 },
} satisfies ToolExample<
  SupercapacitorSelfDischargeRateInput,
  SupercapacitorSelfDischargeRateOutput
>;

export const tool = createSimpleTool({
  id: "electronics/supercapacitor-self-discharge-rate",
  title: "Supercapacitor Self Discharge Rate",
  description:
    "Average open-circuit voltage fall per hour over an observed self-discharge interval; assumes no external load.",
  inputs: [
    {
      id: "initialVolts",
      kind: "number",
      label: "Initial Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "finalVolts",
      kind: "number",
      label: "Final Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "elapsedHours",
      kind: "number",
      label: "Elapsed Hours",
      unit: "h",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "voltsPerHour",
      kind: "number",
      label: "Volts Per Hour",
      unit: "V/h",
    },
  ],
  calculate: (input) =>
    calculateSupercapacitorSelfDischargeRate({
      initialVolts: input.initialVolts as number,
      finalVolts: input.finalVolts as number,
      elapsedHours: input.elapsedHours as number,
    }),
});
export const supercapacitorSelfDischargeRateTool = tool;
export const runSupercapacitorSelfDischargeRate = tool.execute;
export default tool;

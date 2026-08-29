import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VaristorClampingVoltageInput = Readonly<{
  readonly referenceVoltageV: number;
  readonly referenceCurrentAmperes: number;
  readonly pulseCurrentAmperes: number;
  readonly nonlinearityExponent: number;
}>;
export type VaristorClampingVoltageOutput = Readonly<{
  clampingVoltageV: number;
}>;

export const calculateVaristorClampingVoltage = (
  i: VaristorClampingVoltageInput,
): VaristorClampingVoltageOutput => {
  const direct =
    i.referenceVoltageV *
    Math.pow(
      i.pulseCurrentAmperes / i.referenceCurrentAmperes,
      1 / i.nonlinearityExponent,
    );
  const value =
    direct > 0 && Number.isFinite(direct)
      ? direct
      : Math.exp(
          Math.log(i.referenceVoltageV) +
            (Math.log(i.pulseCurrentAmperes) -
              Math.log(i.referenceCurrentAmperes)) /
              i.nonlinearityExponent,
        );
  if (!Number.isFinite(value))
    simpleError("clampingVoltageV", "The inputs produce a non-finite result.");
  return { clampingVoltageV: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    referenceVoltageV: 430,
    referenceCurrentAmperes: 0.001,
    pulseCurrentAmperes: 1,
    nonlinearityExponent: 30,
  },
  output: { clampingVoltageV: 541.3379270714919 },
} satisfies ToolExample<
  VaristorClampingVoltageInput,
  VaristorClampingVoltageOutput
>;

export const tool = createSimpleTool({
  id: "electronics/varistor-clamping-voltage",
  title: "Varistor Clamping Voltage",
  description:
    "Estimate MOV clamping voltage at a specified current from a calibrated power-law V–I curve V=Vref(I/Iref)^(1/alpha); alpha must come from device data.",
  inputs: [
    {
      id: "referenceVoltageV",
      kind: "number",
      label: "Reference (V)",
      unit: "V",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "referenceCurrentAmperes",
      kind: "number",
      label: "Reference Current (A)",
      unit: "A",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "pulseCurrentAmperes",
      kind: "number",
      label: "Pulse Current (A)",
      unit: "A",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "nonlinearityExponent",
      kind: "number",
      label: "Nonlinearity Exponent",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "clampingVoltageV",
      kind: "number",
      label: "Clamping (V)",
      unit: "V",
    },
  ],
  calculate: (input) =>
    calculateVaristorClampingVoltage({
      referenceVoltageV: input.referenceVoltageV as number,
      referenceCurrentAmperes: input.referenceCurrentAmperes as number,
      pulseCurrentAmperes: input.pulseCurrentAmperes as number,
      nonlinearityExponent: input.nonlinearityExponent as number,
    }),
});
export const varistorClampingVoltageTool = tool;
export const runVaristorClampingVoltage = tool.execute;
export default tool;

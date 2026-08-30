import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BjtOutputResistanceInput = Readonly<{
  readonly earlyVoltageV: number;
  readonly collectorEmitterVoltageV: number;
  readonly collectorCurrentA: number;
}>;
export type BjtOutputResistanceOutput = Readonly<{
  readonly outputResistanceOhm: number;
}>;

export const calculateBjtOutputResistance = (
  x: BjtOutputResistanceInput,
): BjtOutputResistanceOutput => {
  if (!Number.isFinite(x.earlyVoltageV) || x.earlyVoltageV < 0)
    simpleError("earlyVoltageV", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.collectorEmitterVoltageV) ||
    x.collectorEmitterVoltageV < 0
  )
    simpleError(
      "collectorEmitterVoltageV",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.collectorCurrentA) || x.collectorCurrentA < 0)
    simpleError("collectorCurrentA", "Provide a finite number at least 0.");
  if (!(x.earlyVoltageV > 0 && x.collectorCurrentA > 0))
    simpleError(
      "input",
      "Early voltage and collector current must be positive.",
    );
  const outputResistanceOhm =
    (x.earlyVoltageV + x.collectorEmitterVoltageV) / x.collectorCurrentA;
  if (!Number.isFinite(outputResistanceOhm))
    simpleError("outputResistanceOhm", "The inputs produce an invalid result.");
  return {
    outputResistanceOhm: Object.is(outputResistanceOhm, -0)
      ? 0
      : outputResistanceOhm,
  };
};

export const example = {
  input: {
    earlyVoltageV: 100,
    collectorEmitterVoltageV: 0,
    collectorCurrentA: 0.01,
  },
  output: { outputResistanceOhm: 10000 },
} satisfies ToolExample<BjtOutputResistanceInput, BjtOutputResistanceOutput>;

export const tool = createSimpleTool({
  id: "electronics/bjt-output-resistance",
  title: "BJT Output Resistance",
  description:
    "Estimate small-signal BJT output resistance from Early voltage magnitude, bias VCE, and collector current at that bias.",
  inputs: [
    {
      id: "earlyVoltageV",
      kind: "number",
      label: "Early voltage magnitude",
      unit: "V",
      minimum: 0,
    },
    {
      id: "collectorEmitterVoltageV",
      kind: "number",
      label: "Bias VCE",
      unit: "V",
      minimum: 0,
    },
    {
      id: "collectorCurrentA",
      kind: "number",
      label: "Collector current at bias",
      unit: "A",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "outputResistanceOhm",
      kind: "number",
      label: "Small-signal output resistance",
      unit: "Ω",
    },
  ],
  calculate: (input) =>
    calculateBjtOutputResistance({
      earlyVoltageV: input.earlyVoltageV as number,
      collectorEmitterVoltageV: input.collectorEmitterVoltageV as number,
      collectorCurrentA: input.collectorCurrentA as number,
    }),
});
export const bjtOutputResistanceTool = tool;
export const runBjtOutputResistance = tool.execute;
export default tool;

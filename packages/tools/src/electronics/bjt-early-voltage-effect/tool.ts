import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BjtEarlyVoltageEffectInput = Readonly<{
  readonly referenceCollectorCurrentA: number;
  readonly referenceVceV: number;
  readonly targetVceV: number;
  readonly earlyVoltageV: number;
}>;
export type BjtEarlyVoltageEffectOutput = Readonly<{
  readonly collectorCurrentA: number;
}>;

export const calculateBjtEarlyVoltageEffect = (
  x: BjtEarlyVoltageEffectInput,
): BjtEarlyVoltageEffectOutput => {
  if (
    !Number.isFinite(x.referenceCollectorCurrentA) ||
    x.referenceCollectorCurrentA < 0
  )
    simpleError(
      "referenceCollectorCurrentA",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.referenceVceV) || x.referenceVceV < 0)
    simpleError("referenceVceV", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.targetVceV) || x.targetVceV < 0)
    simpleError("targetVceV", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.earlyVoltageV) || x.earlyVoltageV < 0)
    simpleError("earlyVoltageV", "Provide a finite number at least 0.");
  if (!(x.earlyVoltageV > 0))
    simpleError("earlyVoltageV", "Early voltage magnitude must be positive.");
  const collectorCurrentA =
    (x.referenceCollectorCurrentA * (x.earlyVoltageV + x.targetVceV)) /
    (x.earlyVoltageV + x.referenceVceV);
  if (!Number.isFinite(collectorCurrentA))
    simpleError("collectorCurrentA", "The inputs produce an invalid result.");
  return {
    collectorCurrentA: Object.is(collectorCurrentA, -0) ? 0 : collectorCurrentA,
  };
};

export const example = {
  input: {
    referenceCollectorCurrentA: 0.01,
    referenceVceV: 0,
    targetVceV: 5,
    earlyVoltageV: 100,
  },
  output: { collectorCurrentA: 0.0105 },
} satisfies ToolExample<
  BjtEarlyVoltageEffectInput,
  BjtEarlyVoltageEffectOutput
>;

export const tool = createSimpleTool({
  id: "electronics/bjt-early-voltage-effect",
  title: "BJT Early Voltage Effect",
  description:
    "Estimate collector current at a new collector-emitter voltage using the linear Early-effect model at fixed base drive.",
  inputs: [
    {
      id: "referenceCollectorCurrentA",
      kind: "number",
      label: "Reference collector current",
      unit: "A",
      minimum: 0,
    },
    {
      id: "referenceVceV",
      kind: "number",
      label: "Reference VCE",
      unit: "V",
      minimum: 0,
    },
    {
      id: "targetVceV",
      kind: "number",
      label: "Target VCE",
      unit: "V",
      minimum: 0,
    },
    {
      id: "earlyVoltageV",
      kind: "number",
      label: "Early voltage magnitude",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "collectorCurrentA",
      kind: "number",
      label: "Estimated collector current",
      unit: "A",
    },
  ],
  calculate: (input) =>
    calculateBjtEarlyVoltageEffect({
      referenceCollectorCurrentA: input.referenceCollectorCurrentA as number,
      referenceVceV: input.referenceVceV as number,
      targetVceV: input.targetVceV as number,
      earlyVoltageV: input.earlyVoltageV as number,
    }),
});
export const bjtEarlyVoltageEffectTool = tool;
export const runBjtEarlyVoltageEffect = tool.execute;
export default tool;

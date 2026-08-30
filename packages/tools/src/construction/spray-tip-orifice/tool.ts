import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SprayTipOrificeInput = Readonly<{
  readonly flowLitersPerMinute: number;
  readonly pressureDropPa: number;
  readonly densityKgPerM3: number;
  readonly dischargeCoefficient: number;
}>;
export type SprayTipOrificeOutput = Readonly<{
  readonly orificeDiameterMm: number;
}>;

export const calculateSprayTipOrifice = (
  x: SprayTipOrificeInput,
): SprayTipOrificeOutput => {
  if (!Number.isFinite(x.flowLitersPerMinute) || x.flowLitersPerMinute < 0)
    simpleError("flowLitersPerMinute", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.pressureDropPa) || x.pressureDropPa < 0)
    simpleError("pressureDropPa", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.densityKgPerM3) || x.densityKgPerM3 < 0)
    simpleError("densityKgPerM3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.dischargeCoefficient) || x.dischargeCoefficient < 0)
    simpleError("dischargeCoefficient", "Provide a finite number at least 0.");
  if (!(
    x.pressureDropPa > 0 &&
    x.densityKgPerM3 > 0 &&
    x.dischargeCoefficient > 0
  ))
    simpleError(
      "input",
      "Pressure, density, and coefficient must be positive.",
    );
  const orificeDiameterMm =
    1000 *
    Math.sqrt(
      (4 * (x.flowLitersPerMinute / 60000)) /
        (Math.PI *
          x.dischargeCoefficient *
          Math.sqrt((2 * x.pressureDropPa) / x.densityKgPerM3)),
    );
  if (!Number.isFinite(orificeDiameterMm))
    simpleError("orificeDiameterMm", "The inputs produce an invalid result.");
  return {
    orificeDiameterMm: Object.is(orificeDiameterMm, -0) ? 0 : orificeDiameterMm,
  };
};

export const example = {
  input: {
    flowLitersPerMinute: 1,
    pressureDropPa: 100000,
    densityKgPerM3: 1000,
    dischargeCoefficient: 0.6,
  },
  output: { orificeDiameterMm: 1.581416661095981 },
} satisfies ToolExample<SprayTipOrificeInput, SprayTipOrificeOutput>;

export const tool = createSimpleTool({
  id: "construction/spray-tip-orifice",
  title: "Spray Tip Orifice",
  description:
    "Infer equivalent circular spray-tip orifice diameter from measured volumetric flow, pressure drop, fluid density, and discharge coefficient.",
  inputs: [
    {
      id: "flowLitersPerMinute",
      kind: "number",
      label: "Volumetric flow",
      unit: "L/min",
      minimum: 0,
    },
    {
      id: "pressureDropPa",
      kind: "number",
      label: "Pressure drop",
      unit: "Pa",
      minimum: 0,
    },
    {
      id: "densityKgPerM3",
      kind: "number",
      label: "Fluid density",
      unit: "kg/m³",
      minimum: 0,
    },
    {
      id: "dischargeCoefficient",
      kind: "number",
      label: "Discharge coefficient",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "orificeDiameterMm",
      kind: "number",
      label: "Equivalent orifice diameter",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateSprayTipOrifice({
      flowLitersPerMinute: input.flowLitersPerMinute as number,
      pressureDropPa: input.pressureDropPa as number,
      densityKgPerM3: input.densityKgPerM3 as number,
      dischargeCoefficient: input.dischargeCoefficient as number,
    }),
});
export const sprayTipOrificeTool = tool;
export const runSprayTipOrifice = tool.execute;
export default tool;

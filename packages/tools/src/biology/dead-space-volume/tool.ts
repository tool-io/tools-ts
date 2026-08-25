import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const deadSpaceVolumeExample = {
  input: { etco2Mmhg: 30, paco2Mmhg: 40, tidalVolumeMl: 500 },
  output: { deadSpaceMl: 125 },
} satisfies ToolExample<
  {
    readonly etco2Mmhg: number;
    readonly paco2Mmhg: number;
    readonly tidalVolumeMl: number;
  },
  { readonly deadSpaceMl: number }
>;

export const deadSpaceVolumeTool = createSimpleTool({
  id: "biology/dead-space-volume",
  title: "Bohr Dead Space",
  description:
    "Compute physiologic dead space with the Bohr equation: Vd = Vt x (PaCO2 - EtCO2) / PaCO2.",
  inputs: [
    {
      id: "tidalVolumeMl",
      kind: "number",
      label: "Tidal volume",
      unit: "mL",
    },
    {
      id: "paco2Mmhg",
      kind: "number",
      label: "Arterial CO2 (PaCO2)",
      unit: "mmHg",
    },
    {
      id: "etco2Mmhg",
      kind: "number",
      label: "End-tidal CO2 (EtCO2)",
      minimum: 0,
      unit: "mmHg",
    },
  ],
  outputs: [
    {
      id: "deadSpaceMl",
      kind: "number",
      label: "Dead space volume",
      unit: "mL",
    },
  ],
  calculate: (input) => {
    const tidalVolumeMl = input.tidalVolumeMl as number;
    const paco2Mmhg = input.paco2Mmhg as number;
    const etco2Mmhg = input.etco2Mmhg as number;
    if (!(tidalVolumeMl > 0))
      simpleError("tidalVolumeMl", "Tidal volume must be positive.");
    if (!(paco2Mmhg > 0)) simpleError("paco2Mmhg", "PaCO2 must be positive.");
    if (etco2Mmhg > paco2Mmhg)
      simpleError("etco2Mmhg", "EtCO2 must not exceed PaCO2.", "invalid_co2");
    return {
      deadSpaceMl: (tidalVolumeMl * (paco2Mmhg - etco2Mmhg)) / paco2Mmhg,
    };
  },
});
export const runDeadSpaceVolume = deadSpaceVolumeTool.execute;
export default deadSpaceVolumeTool;

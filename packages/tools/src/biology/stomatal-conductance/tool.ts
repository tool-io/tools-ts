import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StomatalConductanceInput = {
  readonly transpirationMmolM2S: number;
  readonly vpdKpa: number;
};

export type StomatalConductanceOutput = {
  readonly stomatalConductance: number;
};

export const stomatalConductanceExample = {
  input: { transpirationMmolM2S: 5, vpdKpa: 2 },
  output: { stomatalConductance: 2.5 },
} satisfies ToolExample<StomatalConductanceInput, StomatalConductanceOutput>;

export const stomatalConductanceTool = createSimpleTool({
  id: "biology/stomatal-conductance",
  title: "Stomatal Conductance Estimate",
  description:
    "Estimate stomatal conductance in moles per square metre per second from transpiration and vapour pressure deficit.",
  inputs: [
    {
      id: "transpirationMmolM2S",
      kind: "number",
      label: "Transpiration",
      minimum: 0,
      unit: "mmol/m²/s",
    },
    {
      id: "vpdKpa",
      kind: "number",
      label: "Vapour pressure deficit",
      unit: "kPa",
    },
  ],
  outputs: [
    {
      id: "stomatalConductance",
      kind: "number",
      label: "Stomatal conductance",
      unit: "mol/m²/s",
    },
  ],
  calculate: (input) => {
    const vpdKpa = input.vpdKpa as number;
    if (!(vpdKpa > 0))
      simpleError(
        "vpdKpa",
        "The vapour pressure deficit must be greater than zero.",
      );
    return {
      stomatalConductance: (input.transpirationMmolM2S as number) / vpdKpa,
    };
  },
});
export const runStomatalConductance = stomatalConductanceTool.execute;
export default stomatalConductanceTool;

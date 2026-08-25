import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScrewcapTorqueSpecInput = {
  readonly closureDiameterMm: string;
};

export type ScrewcapTorqueSpecOutput = {
  readonly removalTorqueNm: number;
};

export const screwcapTorqueSpecExample = {
  input: {
    closureDiameterMm: "30",
  },
  output: {
    removalTorqueNm: 1.3,
  },
} satisfies ToolExample<ScrewcapTorqueSpecInput, ScrewcapTorqueSpecOutput>;

const REMOVAL_TORQUE_NM_BY_DIAMETER: Record<string, number> = {
  "28": 1.1,
  "30": 1.3,
  "31.5": 1.5,
};

export const calculateScrewcapTorqueSpec = (
  input: ScrewcapTorqueSpecInput,
): ScrewcapTorqueSpecOutput => {
  const torque = REMOVAL_TORQUE_NM_BY_DIAMETER[input.closureDiameterMm];
  if (torque === undefined)
    simpleError(
      "closureDiameterMm",
      "Supported screwcap diameters are 28, 30, and 31.5 millimeters.",
      "invalid_value",
    );
  return { removalTorqueNm: torque };
};

export const screwcapTorqueSpecTool = createSimpleTool({
  calculate: (input) =>
    calculateScrewcapTorqueSpec(input as unknown as ScrewcapTorqueSpecInput),
  description:
    "Look up the typical consumer removal torque band midpoint for a standard screwcap diameter.",
  id: "oenology/screwcap-torque-spec",
  inputs: [
    {
      description: "Closure diameter in millimeters: 28, 30, or 31.5.",
      id: "closureDiameterMm",
      kind: "string",
      label: "Closure diameter",
    },
  ],
  outputs: [
    {
      description:
        "Typical removal torque the closure should show on the line.",
      id: "removalTorqueNm",
      kind: "number",
      label: "Removal torque",
      unit: "N·m",
    },
  ],
  title: "Screwcap Torque Spec Lookup",
});
export const runScrewcapTorqueSpec = screwcapTorqueSpecTool.execute;
export default screwcapTorqueSpecTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RafixSystem = "rafix-20" | "rafix-22";

export type RafixPatternInput = {
  readonly system: RafixSystem;
};

export type RafixPatternOutput = {
  readonly camDiameterMm: number;
  readonly drillingDepthMm: number;
  readonly edgeDistanceMm: number;
};

const RAFIX_CAM_DIAMETER_MM: Record<RafixSystem, number> = {
  "rafix-20": 20,
  "rafix-22": 22,
};

const RAFIX_DRILLING_DEPTH_MM: Record<RafixSystem, number> = {
  "rafix-20": 12.5,
  "rafix-22": 13,
};

const RAFIX_EDGE_DISTANCE_MM = 34;

export const rafixPatternExample = {
  input: { system: "rafix-22" },
  output: { camDiameterMm: 22, drillingDepthMm: 13, edgeDistanceMm: 34 },
} satisfies ToolExample<RafixPatternInput, RafixPatternOutput>;

export const rafixPatternTool = createSimpleTool({
  id: "carpentry/rafix-bohrbild",
  title: "Rafix Drilling Pattern",
  description:
    "Look up the Rafix cam diameter, drilling depth, and edge distance for a given connector system.",
  inputs: [
    {
      description: "Rafix connector system: rafix-20 or rafix-22.",
      enum: ["rafix-20", "rafix-22"],
      id: "system",
      kind: "string",
      label: "Rafix system",
    },
  ],
  outputs: [
    {
      description: "Cam diameter in millimeters.",
      id: "camDiameterMm",
      kind: "number",
      label: "Cam diameter",
      unit: "mm",
    },
    {
      description: "Drilling depth for the cam housing in millimeters.",
      id: "drillingDepthMm",
      kind: "number",
      label: "Drilling depth",
      unit: "mm",
    },
    {
      description:
        "Center distance of the cam housing from the panel edge in millimeters.",
      id: "edgeDistanceMm",
      kind: "number",
      label: "Edge distance",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const system = input.system as RafixSystem;
    if (!(system in RAFIX_CAM_DIAMETER_MM))
      simpleError("system", "Unknown Rafix system.", "unknown_system");
    return {
      camDiameterMm: RAFIX_CAM_DIAMETER_MM[system],
      drillingDepthMm: RAFIX_DRILLING_DEPTH_MM[system],
      edgeDistanceMm: RAFIX_EDGE_DISTANCE_MM,
    };
  },
});
export const runRafixPattern = rafixPatternTool.execute;
export default rafixPatternTool;

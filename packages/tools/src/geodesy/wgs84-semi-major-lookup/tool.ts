import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type Wgs84SemiMajorLookupInput = {
  readonly model: "wgs84-original" | "wgs84-refined";
};

export type Wgs84SemiMajorLookupOutput = {
  readonly semiMajorAxisMeters: number;
};

const SEMI_MAJOR_METERS = {
  "wgs84-original": 6378137,
  "wgs84-refined": 6378137,
} as const;

export const calculateWgs84SemiMajorLookup = (
  input: Wgs84SemiMajorLookupInput,
): Wgs84SemiMajorLookupOutput => ({
  semiMajorAxisMeters: SEMI_MAJOR_METERS[input.model],
});

export const wgs84SemiMajorLookupExample = {
  input: { model: "wgs84-original" },
  output: { semiMajorAxisMeters: 6378137 },
} satisfies ToolExample<Wgs84SemiMajorLookupInput, Wgs84SemiMajorLookupOutput>;

export const wgs84SemiMajorLookupTool = createSimpleTool({
  id: "geodesy/wgs84-semi-major-lookup",
  title: "WGS84 Semi Major Lookup",
  description:
    "Return the WGS84 ellipsoid semi-major axis in metres for the requested realisation.",
  inputs: [
    {
      default: "wgs84-original",
      description:
        "WGS84 realisation; the semi-major axis is identical across realisations.",
      enum: ["wgs84-original", "wgs84-refined"],
      id: "model",
      kind: "string",
      label: "Realisation",
    },
  ],
  outputs: [
    {
      description: "Ellipsoid semi-major axis a in metres.",
      id: "semiMajorAxisMeters",
      kind: "number",
      label: "Semi-major axis",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateWgs84SemiMajorLookup({
      model: input.model as Wgs84SemiMajorLookupInput["model"],
    }),
});

export const runWgs84SemiMajorLookup = wgs84SemiMajorLookupTool.execute;
export default wgs84SemiMajorLookupTool;

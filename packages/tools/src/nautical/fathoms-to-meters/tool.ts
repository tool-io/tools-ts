import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const METERS_PER_FATHOM = 1.8288;

export type FathomsToMetersInput = {
  readonly fathoms: number;
};

export type FathomsToMetersOutput = {
  readonly meters: number;
};

export const fathomsToMetersExample = {
  input: { fathoms: 10 },
  output: { meters: 18.288 },
} satisfies ToolExample<FathomsToMetersInput, FathomsToMetersOutput>;

export const fathomsToMetersTool = createSimpleTool({
  id: "nautical/fathoms-to-meters",
  title: "Fathoms to Meters Converter",
  description:
    "Convert a depth in fathoms to meters using the exact international fathom of one point eight two eight eight meters.",
  inputs: [{ id: "fathoms", kind: "number", label: "Fathoms", minimum: 0 }],
  outputs: [{ id: "meters", kind: "number", label: "Meters" }],
  calculate: (input) => ({
    meters: (input.fathoms as number) * METERS_PER_FATHOM,
  }),
});
export const runFathomsToMeters = fathomsToMetersTool.execute;
export default fathomsToMetersTool;

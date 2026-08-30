import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NdFilterStopsInput = Readonly<{
  readonly filterFactor: number;
}>;
export type NdFilterStopsOutput = Readonly<{
  readonly attenuationStops: number;
}>;

export const calculateNdFilterStops = (
  x: NdFilterStopsInput,
): NdFilterStopsOutput => {
  if (!Number.isFinite(x.filterFactor) || x.filterFactor < 1)
    simpleError("filterFactor", "Provide a finite number at least 1.");
  const attenuationStops = Math.log2(x.filterFactor);
  if (!Number.isFinite(attenuationStops))
    simpleError(
      "attenuationStops",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    attenuationStops: Object.is(attenuationStops, -0) ? 0 : attenuationStops,
  };
};

export const example = {
  input: { filterFactor: 8 },
  output: { attenuationStops: 3 },
} satisfies ToolExample<NdFilterStopsInput, NdFilterStopsOutput>;

export const tool = createSimpleTool({
  id: "film/nd-filter-stops",
  title: "ND Filter Stops",
  description:
    "Neutral-density attenuation in stops from a stated optical filter factor; factor 2 is one stop.",
  inputs: [
    { id: "filterFactor", kind: "number", label: "Filter Factor", minimum: 1 },
  ],
  outputs: [
    {
      id: "attenuationStops",
      kind: "number",
      label: "Attenuation Stops",
      unit: "stops",
    },
  ],
  calculate: (input) =>
    calculateNdFilterStops({
      filterFactor: input.filterFactor as number,
    }),
});
export const ndFilterStopsTool = tool;
export const runNdFilterStops = tool.execute;
export default tool;

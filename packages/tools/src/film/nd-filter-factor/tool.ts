import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NdFilterFactorInput = Readonly<{
  readonly attenuationStops: number;
}>;
export type NdFilterFactorOutput = Readonly<{
  readonly filterFactor: number;
}>;

export const calculateNdFilterFactor = (
  x: NdFilterFactorInput,
): NdFilterFactorOutput => {
  if (!Number.isFinite(x.attenuationStops) || x.attenuationStops < 0)
    simpleError("attenuationStops", "Provide a finite number at least 0.");
  const filterFactor = 2 ** x.attenuationStops;
  if (!Number.isFinite(filterFactor))
    simpleError(
      "filterFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { filterFactor: Object.is(filterFactor, -0) ? 0 : filterFactor };
};

export const example = {
  input: { attenuationStops: 3 },
  output: { filterFactor: 8 },
} satisfies ToolExample<NdFilterFactorInput, NdFilterFactorOutput>;

export const tool = createSimpleTool({
  id: "film/nd-filter-factor",
  title: "ND Filter Factor",
  description:
    "Neutral-density filter factor from attenuation in stops: factor=2^stops.",
  inputs: [
    {
      id: "attenuationStops",
      kind: "number",
      label: "Attenuation Stops",
      unit: "stops",
      minimum: 0,
    },
  ],
  outputs: [{ id: "filterFactor", kind: "number", label: "Filter Factor" }],
  calculate: (input) =>
    calculateNdFilterFactor({
      attenuationStops: input.attenuationStops as number,
    }),
});
export const ndFilterFactorTool = tool;
export const runNdFilterFactor = tool.execute;
export default tool;

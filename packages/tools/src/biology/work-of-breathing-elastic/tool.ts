import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const workOfBreathingElasticExample = {
  input: { elastanceCmh2oPerL: 10, tidalVolumeLiters: 0.5 },
  output: { elasticWorkJoules: 0.12262500000000001 },
} satisfies ToolExample<
  {
    readonly elastanceCmh2oPerL: number;
    readonly tidalVolumeLiters: number;
  },
  { readonly elasticWorkJoules: number }
>;

export const workOfBreathingElasticTool = createSimpleTool({
  id: "biology/work-of-breathing-elastic",
  title: "Elastic WOB",
  description:
    "Compute elastic work of breathing per breath as one half times elastance times tidal volume squared, converted to joules with 0.0981 J per cmH2O-L.",
  inputs: [
    {
      id: "elastanceCmh2oPerL",
      label: "Elastance",
      kind: "number",
      unit: "cmH2O/L",
    },
    {
      id: "tidalVolumeLiters",
      label: "Tidal volume",
      kind: "number",
      unit: "L",
    },
  ],
  outputs: [
    {
      id: "elasticWorkJoules",
      label: "Elastic work per breath",
      kind: "number",
      unit: "J/breath",
    },
  ],
  calculate: (input) => {
    const elastanceCmh2oPerL = input.elastanceCmh2oPerL as number;
    const tidalVolumeLiters = input.tidalVolumeLiters as number;
    if (elastanceCmh2oPerL <= 0)
      simpleError("elastanceCmh2oPerL", "Elastance must be greater than zero.");
    if (tidalVolumeLiters <= 0)
      simpleError(
        "tidalVolumeLiters",
        "Tidal volume must be greater than zero.",
      );
    return {
      elasticWorkJoules:
        0.5 * elastanceCmh2oPerL * Math.pow(tidalVolumeLiters, 2) * 0.0981,
    };
  },
});
export const runWorkOfBreathingElastic = workOfBreathingElasticTool.execute;
export default workOfBreathingElasticTool;

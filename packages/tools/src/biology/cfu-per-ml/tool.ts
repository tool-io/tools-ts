import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CfuPerMlInput = {
  readonly colonyCount: number;
  readonly dilutionFactor?: number;
  readonly platingVolumeMl: number;
};

export type CfuPerMlOutput = {
  readonly cfuPerMl: number;
};

export const cfuPerMlExample = {
  input: { colonyCount: 46, dilutionFactor: 100, platingVolumeMl: 0.1 },
  output: { cfuPerMl: 46000 },
} satisfies ToolExample<CfuPerMlInput, CfuPerMlOutput>;

export const cfuPerMlTool = createSimpleTool({
  id: "biology/cfu-per-ml",
  title: "CFU Per mL",
  description:
    "Estimate colony-forming units per milliliter from a plate colony count, dilution factor, and plating volume.",
  inputs: [
    { id: "colonyCount", label: "Colony count", kind: "integer", minimum: 0 },
    {
      default: 1,
      id: "dilutionFactor",
      label: "Dilution factor",
      kind: "number",
      minimum: 1,
    },
    {
      id: "platingVolumeMl",
      label: "Plating volume",
      kind: "number",
      unit: "mL",
    },
  ],
  outputs: [{ id: "cfuPerMl", label: "CFU per mL", kind: "number" }],
  calculate: (input) => {
    const platingVolumeMl = input.platingVolumeMl as number;
    if (!(platingVolumeMl > 0))
      simpleError("platingVolumeMl", "Plating volume must be positive.");
    return {
      cfuPerMl:
        ((input.colonyCount as number) * (input.dilutionFactor as number)) /
        platingVolumeMl,
    };
  },
});
export const runCfuPerMl = cfuPerMlTool.execute;
export default cfuPerMlTool;

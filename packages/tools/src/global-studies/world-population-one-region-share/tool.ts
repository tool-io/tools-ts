import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regionPopulation: number;
  readonly worldPopulation: number;
  readonly regionGrowth: number;
  readonly worldGrowth: number;
};
export type Output = { readonly share: number; readonly nextShare: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regionPopulation: { type: "number", minimum: 0 },
    worldPopulation: { type: "number", exclusiveMinimum: 0 },
    regionGrowth: { type: "number", minimum: -1 },
    worldGrowth: { type: "number", exclusiveMinimum: -1 },
  },
  required: [
    "regionPopulation",
    "worldPopulation",
    "regionGrowth",
    "worldGrowth",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, nextShare: { type: "number" } },
  required: ["share", "nextShare"],
} as const;
/** One-period share projection under caller-supplied growth factors, without estimating demographic rates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regionPopulation, worldPopulation, regionGrowth, worldGrowth } =
    request;
  const compute = (): Output => {
    H.positive(worldPopulation);
    H.domain(
      regionPopulation >= 0 &&
        regionPopulation <= worldPopulation &&
        regionGrowth >= -1 &&
        worldGrowth > -1,
    );
    return {
      share: regionPopulation / worldPopulation,
      nextShare:
        (regionPopulation * (1 + regionGrowth)) /
        (worldPopulation * (1 + worldGrowth)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    regionPopulation: 100,
    worldPopulation: 1000,
    regionGrowth: 0.1,
    worldGrowth: 0.05,
  },
  output: { share: 0.1, nextShare: 0.10476190476190478 },
} satisfies ToolExample<Input, Output>;
export const worldPopulationOneRegionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/world-population-one-region-share",
    title: "World Population One Region Share Tool",
    description:
      "One-period share projection under caller-supplied growth factors, without estimating demographic rates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regionPopulation: { type: "number", minimum: 0 },
        worldPopulation: { type: "number", exclusiveMinimum: 0 },
        regionGrowth: { type: "number", minimum: -1 },
        worldGrowth: { type: "number", exclusiveMinimum: -1 },
      },
      required: [
        "regionPopulation",
        "worldPopulation",
        "regionGrowth",
        "worldGrowth",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, nextShare: { type: "number" } },
      required: ["share", "nextShare"],
    },
    ports: {
      inputs: [
        {
          id: "regionPopulation",
          label: "Region Population",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "worldPopulation",
          label: "World Population",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "regionGrowth",
          label: "Region Growth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "worldGrowth",
          label: "World Growth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "nextShare", label: "Next Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = worldPopulationOneRegionShareTool.execute;
export default worldPopulationOneRegionShareTool;

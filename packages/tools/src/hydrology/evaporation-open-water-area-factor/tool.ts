import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly depth: number;
  readonly openArea: number;
  readonly iceFraction: number;
};
export type Output = {
  readonly exposedArea: number;
  readonly evaporatedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depth: { type: "number", minimum: 0 },
    openArea: { type: "number", minimum: 0 },
    iceFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["depth", "openArea", "iceFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposedArea: { type: "number" },
    evaporatedVolume: { type: "number" },
  },
  required: ["exposedArea", "evaporatedVolume"],
} as const;
/** Calculate evaporation open water area factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { depth, openArea, iceFraction } = request;
  const compute = (): Output => {
    H.domain(depth >= 0 && openArea >= 0);
    H.probability(iceFraction);
    return {
      exposedArea: openArea * (1 - iceFraction),
      evaporatedVolume: depth * openArea * (1 - iceFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { depth: 0.01, openArea: 1000, iceFraction: 0.2 },
  output: { exposedArea: 800, evaporatedVolume: 8 },
} satisfies ToolExample<Input, Output>;
export const evaporationOpenWaterAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/evaporation-open-water-area-factor",
    title: "Evaporation Open Water Area Factor Tool",
    description:
      "Calculate evaporation open water area factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depth: { type: "number", minimum: 0 },
        openArea: { type: "number", minimum: 0 },
        iceFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["depth", "openArea", "iceFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposedArea: { type: "number" },
        evaporatedVolume: { type: "number" },
      },
      required: ["exposedArea", "evaporatedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openArea",
          label: "Open Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "iceFraction",
          label: "Ice Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "exposedArea",
          label: "Exposed Area",
          valueType: { type: "number" },
        },
        {
          id: "evaporatedVolume",
          label: "Evaporated Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = evaporationOpenWaterAreaFactorTool.execute;
export default evaporationOpenWaterAreaFactorTool;

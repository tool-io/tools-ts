import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialCount: number;
  readonly harvested: number;
  readonly unmarketable: number;
  readonly retained: number;
};
export type Output = {
  readonly unaccounted: number;
  readonly harvestedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialCount: { type: "integer", minimum: 1 },
    harvested: { type: "integer", minimum: 0 },
    unmarketable: { type: "integer", minimum: 0 },
    retained: { type: "integer", minimum: 0 },
  },
  required: ["initialCount", "harvested", "unmarketable", "retained"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unaccounted: { type: "integer" },
    harvestedShare: { type: "number" },
  },
  required: ["unaccounted", "harvestedShare"],
} as const;
/** Calculate vertical farm crop loss one tray term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialCount, harvested, unmarketable, retained } = request;
  const compute = (): Output => {
    H.integer(initialCount, 1);
    H.integer(harvested, 0);
    H.integer(unmarketable, 0);
    H.integer(retained, 0);
    return {
      unaccounted: initialCount - harvested - unmarketable - retained,
      harvestedShare: harvested / initialCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialCount: 100, harvested: 80, unmarketable: 10, retained: 5 },
  output: { unaccounted: 5, harvestedShare: 0.8 },
} satisfies ToolExample<Input, Output>;
export const verticalFarmCropLossOneTrayTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/vertical-farm-crop-loss-one-tray-term",
    title: "Vertical Farm Crop Loss One Tray Term Tool",
    description:
      "Calculate vertical farm crop loss one tray term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialCount: { type: "integer", minimum: 1 },
        harvested: { type: "integer", minimum: 0 },
        unmarketable: { type: "integer", minimum: 0 },
        retained: { type: "integer", minimum: 0 },
      },
      required: ["initialCount", "harvested", "unmarketable", "retained"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unaccounted: { type: "integer" },
        harvestedShare: { type: "number" },
      },
      required: ["unaccounted", "harvestedShare"],
    },
    ports: {
      inputs: [
        {
          id: "initialCount",
          label: "Initial Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "harvested",
          label: "Harvested",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unmarketable",
          label: "Unmarketable",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "retained",
          label: "Retained",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unaccounted",
          label: "Unaccounted",
          valueType: { type: "integer" },
        },
        {
          id: "harvestedShare",
          label: "Harvested Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = verticalFarmCropLossOneTrayTermTool.execute;
export default verticalFarmCropLossOneTrayTermTool;

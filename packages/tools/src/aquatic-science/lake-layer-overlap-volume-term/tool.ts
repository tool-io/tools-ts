import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstVolume: number;
  readonly secondVolume: number;
  readonly sharedVolume: number;
  readonly lakeVolume: number;
};
export type Output = {
  readonly uniqueVolume: number;
  readonly unrepresented: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstVolume: { type: "number", minimum: 0 },
    secondVolume: { type: "number", minimum: 0 },
    sharedVolume: { type: "number", minimum: 0 },
    lakeVolume: { type: "number", minimum: 0 },
  },
  required: ["firstVolume", "secondVolume", "sharedVolume", "lakeVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueVolume: { type: "number" },
    unrepresented: { type: "number" },
  },
  required: ["uniqueVolume", "unrepresented"],
} as const;
/** Calculate lake layer overlap volume term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstVolume, secondVolume, sharedVolume, lakeVolume } = request;
  const compute = (): Output => {
    H.domain(
      firstVolume >= 0 &&
        secondVolume >= 0 &&
        sharedVolume >= 0 &&
        sharedVolume <= Math.min(firstVolume, secondVolume) &&
        lakeVolume >= 0,
    );
    return {
      uniqueVolume: firstVolume + secondVolume - sharedVolume,
      unrepresented: lakeVolume - firstVolume - secondVolume + sharedVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstVolume: 100,
    secondVolume: 80,
    sharedVolume: 20,
    lakeVolume: 200,
  },
  output: { uniqueVolume: 160, unrepresented: 40 },
} satisfies ToolExample<Input, Output>;
export const lakeLayerOverlapVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/lake-layer-overlap-volume-term",
    title: "Lake Layer Overlap Volume Term Tool",
    description:
      "Calculate lake layer overlap volume term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstVolume: { type: "number", minimum: 0 },
        secondVolume: { type: "number", minimum: 0 },
        sharedVolume: { type: "number", minimum: 0 },
        lakeVolume: { type: "number", minimum: 0 },
      },
      required: ["firstVolume", "secondVolume", "sharedVolume", "lakeVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueVolume: { type: "number" },
        unrepresented: { type: "number" },
      },
      required: ["uniqueVolume", "unrepresented"],
    },
    ports: {
      inputs: [
        {
          id: "firstVolume",
          label: "First Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondVolume",
          label: "Second Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedVolume",
          label: "Shared Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lakeVolume",
          label: "Lake Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uniqueVolume",
          label: "Unique Volume",
          valueType: { type: "number" },
        },
        {
          id: "unrepresented",
          label: "Unrepresented",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lakeLayerOverlapVolumeTermTool.execute;
export default lakeLayerOverlapVolumeTermTool;

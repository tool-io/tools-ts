import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly planArea: number;
  readonly totalHeight: number;
  readonly waterHeight: number;
  readonly freeboardHeight: number;
};
export type Output = {
  readonly physicalEmptyVolume: number;
  readonly usableEmptyVolume: number;
  readonly freeboardVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    planArea: { type: "number", exclusiveMinimum: 0 },
    totalHeight: { type: "number", minimum: 0 },
    waterHeight: { type: "number", minimum: 0 },
    freeboardHeight: { type: "number", minimum: 0 },
  },
  required: ["planArea", "totalHeight", "waterHeight", "freeboardHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physicalEmptyVolume: { type: "number" },
    usableEmptyVolume: { type: "number" },
    freeboardVolume: { type: "number" },
  },
  required: ["physicalEmptyVolume", "usableEmptyVolume", "freeboardVolume"],
} as const;
/** Calculate rainwater tank freeboard volume term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { planArea, totalHeight, waterHeight, freeboardHeight } = request;
  const compute = (): Output => {
    H.positive(planArea);
    H.domain(
      totalHeight >= 0 &&
        waterHeight >= 0 &&
        waterHeight <= totalHeight &&
        freeboardHeight >= 0 &&
        freeboardHeight <= totalHeight,
    );
    return {
      physicalEmptyVolume: planArea * (totalHeight - waterHeight),
      usableEmptyVolume: Math.max(
        0,
        planArea * (totalHeight - freeboardHeight - waterHeight),
      ),
      freeboardVolume: planArea * freeboardHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { planArea: 10, totalHeight: 3, waterHeight: 2, freeboardHeight: 0.2 },
  output: {
    physicalEmptyVolume: 10,
    usableEmptyVolume: 7.999999999999998,
    freeboardVolume: 2,
  },
} satisfies ToolExample<Input, Output>;
export const rainwaterTankFreeboardVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/rainwater-tank-freeboard-volume-term",
    title: "Rainwater Tank Freeboard Volume Term Tool",
    description:
      "Calculate rainwater tank freeboard volume term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        planArea: { type: "number", exclusiveMinimum: 0 },
        totalHeight: { type: "number", minimum: 0 },
        waterHeight: { type: "number", minimum: 0 },
        freeboardHeight: { type: "number", minimum: 0 },
      },
      required: ["planArea", "totalHeight", "waterHeight", "freeboardHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        physicalEmptyVolume: { type: "number" },
        usableEmptyVolume: { type: "number" },
        freeboardVolume: { type: "number" },
      },
      required: ["physicalEmptyVolume", "usableEmptyVolume", "freeboardVolume"],
    },
    ports: {
      inputs: [
        {
          id: "planArea",
          label: "Plan Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalHeight",
          label: "Total Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterHeight",
          label: "Water Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freeboardHeight",
          label: "Freeboard Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "physicalEmptyVolume",
          label: "Physical Empty Volume",
          valueType: { type: "number" },
        },
        {
          id: "usableEmptyVolume",
          label: "Usable Empty Volume",
          valueType: { type: "number" },
        },
        {
          id: "freeboardVolume",
          label: "Freeboard Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rainwaterTankFreeboardVolumeTermTool.execute;
export default rainwaterTankFreeboardVolumeTermTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceStorage: number;
  readonly referenceLevel: number;
  readonly currentLevel: number;
  readonly referenceArea: number;
  readonly areaSlope: number;
};
export type Output = { readonly currentArea: number; readonly storage: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceStorage: { type: "number", minimum: 0 },
    referenceLevel: { type: "number" },
    currentLevel: { type: "number" },
    referenceArea: { type: "number", minimum: 0 },
    areaSlope: { type: "number" },
  },
  required: [
    "referenceStorage",
    "referenceLevel",
    "currentLevel",
    "referenceArea",
    "areaSlope",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { currentArea: { type: "number" }, storage: { type: "number" } },
  required: ["currentArea", "storage"],
} as const;
/** Integrate a locally linear area-elevation model from an explicit storage anchor; validity outside the calibrated interval is external. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    referenceStorage,
    referenceLevel,
    currentLevel,
    referenceArea,
    areaSlope,
  } = request;
  const compute = (): Output => {
    H.domain(
      referenceStorage >= 0 &&
        referenceArea >= 0 &&
        referenceArea + areaSlope * (currentLevel - referenceLevel) >= 0,
    );
    return {
      currentArea: referenceArea + areaSlope * (currentLevel - referenceLevel),
      storage:
        referenceStorage +
        referenceArea * (currentLevel - referenceLevel) +
        (areaSlope * (currentLevel - referenceLevel) ** 2) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceStorage: 1000,
    referenceLevel: 10,
    currentLevel: 12,
    referenceArea: 100,
    areaSlope: 20,
  },
  output: { currentArea: 140, storage: 1240 },
} satisfies ToolExample<Input, Output>;
export const reservoirLevelAreaStorageTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/reservoir-level-area-storage-term",
    title: "Reservoir Level Area Storage Term Tool",
    description:
      "Integrate a locally linear area-elevation model from an explicit storage anchor; validity outside the calibrated interval is external.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceStorage: { type: "number", minimum: 0 },
        referenceLevel: { type: "number" },
        currentLevel: { type: "number" },
        referenceArea: { type: "number", minimum: 0 },
        areaSlope: { type: "number" },
      },
      required: [
        "referenceStorage",
        "referenceLevel",
        "currentLevel",
        "referenceArea",
        "areaSlope",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentArea: { type: "number" },
        storage: { type: "number" },
      },
      required: ["currentArea", "storage"],
    },
    ports: {
      inputs: [
        {
          id: "referenceStorage",
          label: "Reference Storage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLevel",
          label: "Reference Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentLevel",
          label: "Current Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceArea",
          label: "Reference Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaSlope",
          label: "Area Slope",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "currentArea",
          label: "Current Area",
          valueType: { type: "number" },
        },
        { id: "storage", label: "Storage", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = reservoirLevelAreaStorageTermTool.execute;
export default reservoirLevelAreaStorageTermTool;

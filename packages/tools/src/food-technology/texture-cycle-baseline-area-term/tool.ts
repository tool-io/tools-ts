import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredArea: number;
  readonly baselineForce: number;
  readonly travelDistance: number;
  readonly referenceArea: number;
};
export type Output = {
  readonly correctedArea: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredArea: { type: "number" },
    baselineForce: { type: "number" },
    travelDistance: { type: "number", minimum: 0 },
    referenceArea: { type: "number" },
  },
  required: [
    "measuredArea",
    "baselineForce",
    "travelDistance",
    "referenceArea",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedArea: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["correctedArea", "referenceGap"],
} as const;
/** Subtract a supplied constant bench force baseline from an area integral without texture classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredArea, baselineForce, travelDistance, referenceArea } =
    request;
  const compute = (): Output => {
    H.domain(travelDistance >= 0);
    return {
      correctedArea: measuredArea - baselineForce * travelDistance,
      referenceGap:
        measuredArea - baselineForce * travelDistance - referenceArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredArea: 100,
    baselineForce: 2,
    travelDistance: 10,
    referenceArea: 75,
  },
  output: { correctedArea: 80, referenceGap: 5 },
} satisfies ToolExample<Input, Output>;
export const textureCycleBaselineAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/texture-cycle-baseline-area-term",
    title: "Texture Cycle Baseline Area Term Tool",
    description:
      "Subtract a supplied constant bench force baseline from an area integral without texture classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredArea: { type: "number" },
        baselineForce: { type: "number" },
        travelDistance: { type: "number", minimum: 0 },
        referenceArea: { type: "number" },
      },
      required: [
        "measuredArea",
        "baselineForce",
        "travelDistance",
        "referenceArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedArea: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["correctedArea", "referenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "measuredArea",
          label: "Measured Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baselineForce",
          label: "Baseline Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "travelDistance",
          label: "Travel Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceArea",
          label: "Reference Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedArea",
          label: "Corrected Area",
          valueType: { type: "number" },
        },
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = textureCycleBaselineAreaTermTool.execute;
export default textureCycleBaselineAreaTermTool;

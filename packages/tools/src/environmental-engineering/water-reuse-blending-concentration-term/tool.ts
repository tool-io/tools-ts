import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstVolume: number;
  readonly firstConcentration: number;
  readonly secondVolume: number;
  readonly secondConcentration: number;
};
export type Output = {
  readonly blendedConcentration: number;
  readonly totalVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstVolume: { type: "number", minimum: 0 },
    firstConcentration: { type: "number", minimum: 0 },
    secondVolume: { type: "number", minimum: 0 },
    secondConcentration: { type: "number", minimum: 0 },
  },
  required: [
    "firstVolume",
    "firstConcentration",
    "secondVolume",
    "secondConcentration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blendedConcentration: { type: "number" },
    totalVolume: { type: "number" },
  },
  required: ["blendedConcentration", "totalVolume"],
} as const;
/** Calculate conservative two-volume water blending concentration with additive volumes and compatible mass-concentration units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstVolume, firstConcentration, secondVolume, secondConcentration } =
    request;
  const compute = (): Output => {
    H.domain(firstVolume >= 0, "firstVolume");
    H.domain(secondVolume >= 0, "secondVolume");
    H.domain(firstConcentration >= 0, "firstConcentration");
    H.domain(secondConcentration >= 0, "secondConcentration");
    return (() => {
      const totalVolume = firstVolume + secondVolume;
      H.domain(totalVolume > 0 && Number.isFinite(totalVolume), "firstVolume");
      return {
        blendedConcentration:
          firstConcentration * (firstVolume / totalVolume) +
          secondConcentration * (secondVolume / totalVolume),
        totalVolume,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstVolume: 3,
    firstConcentration: 10,
    secondVolume: 1,
    secondConcentration: 30,
  },
  output: { blendedConcentration: 15, totalVolume: 4 },
} satisfies ToolExample<Input, Output>;
export const waterReuseBlendingConcentrationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-engineering/water-reuse-blending-concentration-term",
      title: "Water Reuse Blending Concentration Term Tool",
      description:
        "Calculate conservative two-volume water blending concentration with additive volumes and compatible mass-concentration units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstVolume: { type: "number", minimum: 0 },
          firstConcentration: { type: "number", minimum: 0 },
          secondVolume: { type: "number", minimum: 0 },
          secondConcentration: { type: "number", minimum: 0 },
        },
        required: [
          "firstVolume",
          "firstConcentration",
          "secondVolume",
          "secondConcentration",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          blendedConcentration: { type: "number" },
          totalVolume: { type: "number" },
        },
        required: ["blendedConcentration", "totalVolume"],
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
            id: "firstConcentration",
            label: "First Concentration",
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
            id: "secondConcentration",
            label: "Second Concentration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "blendedConcentration",
            label: "Blended Concentration",
            valueType: { type: "number" },
          },
          {
            id: "totalVolume",
            label: "Total Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = waterReuseBlendingConcentrationTermTool.execute;
export default waterReuseBlendingConcentrationTermTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gridAzimuth: number;
  readonly convergence: number;
};
export type Output = {
  readonly trueAzimuth: number;
  readonly gridAzimuth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gridAzimuth: { type: "number" },
    convergence: { type: "number" },
  },
  required: ["gridAzimuth", "convergence"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trueAzimuth: { type: "number" },
    gridAzimuth: { type: "number" },
  },
  required: ["trueAzimuth", "gridAzimuth"],
} as const;
/** Apply true azimuth = grid azimuth + explicitly supplied east-positive meridian convergence in degrees. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { gridAzimuth, convergence } = input;
  const compute = (): Output => {
    return {
      trueAzimuth: H.mod(gridAzimuth + convergence, 360),
      gridAzimuth: H.mod(gridAzimuth, 360),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { gridAzimuth: 350, convergence: 15 },
  output: { trueAzimuth: 5, gridAzimuth: 350 },
} satisfies ToolExample<Input, Output>;
export const geographicAzimuthMeridianReferencePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geography/geographic-azimuth-meridian-reference-pair",
      title: "Geographic Azimuth Meridian Reference Pair Tool",
      description:
        "Apply true azimuth = grid azimuth + explicitly supplied east-positive meridian convergence in degrees.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gridAzimuth: { type: "number" },
          convergence: { type: "number" },
        },
        required: ["gridAzimuth", "convergence"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          trueAzimuth: { type: "number" },
          gridAzimuth: { type: "number" },
        },
        required: ["trueAzimuth", "gridAzimuth"],
      },
      ports: {
        inputs: [
          {
            id: "gridAzimuth",
            label: "Grid Azimuth",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "convergence",
            label: "Convergence",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "trueAzimuth",
            label: "True Azimuth",
            valueType: { type: "number" },
          },
          {
            id: "gridAzimuth",
            label: "Grid Azimuth",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = geographicAzimuthMeridianReferencePairTool.execute;
export default geographicAzimuthMeridianReferencePairTool;

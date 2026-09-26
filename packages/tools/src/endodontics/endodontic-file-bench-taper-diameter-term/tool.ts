import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tipDiameter: number;
  readonly taperPerLength: number;
  readonly distance: number;
  readonly segmentLength: number;
};
export type Output = {
  readonly localDiameter: number;
  readonly endDiameter: number;
  readonly radiusIncrease: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tipDiameter: { type: "number", minimum: 0 },
    taperPerLength: { type: "number", minimum: 0 },
    distance: { type: "number", minimum: 0 },
    segmentLength: { type: "number" },
  },
  required: ["tipDiameter", "taperPerLength", "distance", "segmentLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localDiameter: { type: "number" },
    endDiameter: { type: "number" },
    radiusIncrease: { type: "number" },
  },
  required: ["localDiameter", "endDiameter", "radiusIncrease"],
} as const;
/** Linear bench taper geometry with explicitly supplied coefficients. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tipDiameter, taperPerLength, distance, segmentLength } = request;
  const compute = (): Output => {
    H.domain(
      tipDiameter >= 0 &&
        taperPerLength >= 0 &&
        distance >= 0 &&
        segmentLength >= distance,
    );
    return {
      localDiameter: tipDiameter + taperPerLength * distance,
      endDiameter: tipDiameter + taperPerLength * segmentLength,
      radiusIncrease: (taperPerLength * distance) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tipDiameter: 0.2,
    taperPerLength: 0.04,
    distance: 5,
    segmentLength: 10,
  },
  output: {
    localDiameter: 0.4,
    endDiameter: 0.6000000000000001,
    radiusIncrease: 0.1,
  },
} satisfies ToolExample<Input, Output>;
export const endodonticFileBenchTaperDiameterTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "endodontics/endodontic-file-bench-taper-diameter-term",
      title: "Endodontic File Bench Taper Diameter Term Tool",
      description:
        "Linear bench taper geometry with explicitly supplied coefficients.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tipDiameter: { type: "number", minimum: 0 },
          taperPerLength: { type: "number", minimum: 0 },
          distance: { type: "number", minimum: 0 },
          segmentLength: { type: "number" },
        },
        required: [
          "tipDiameter",
          "taperPerLength",
          "distance",
          "segmentLength",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          localDiameter: { type: "number" },
          endDiameter: { type: "number" },
          radiusIncrease: { type: "number" },
        },
        required: ["localDiameter", "endDiameter", "radiusIncrease"],
      },
      ports: {
        inputs: [
          {
            id: "tipDiameter",
            label: "Tip Diameter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "taperPerLength",
            label: "Taper Per Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "distance",
            label: "Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "segmentLength",
            label: "Segment Length",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "localDiameter",
            label: "Local Diameter",
            valueType: { type: "number" },
          },
          {
            id: "endDiameter",
            label: "End Diameter",
            valueType: { type: "number" },
          },
          {
            id: "radiusIncrease",
            label: "Radius Increase",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = endodonticFileBenchTaperDiameterTermTool.execute;
export default endodonticFileBenchTaperDiameterTermTool;

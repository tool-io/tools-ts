import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shorelineCoordinate: number;
  readonly referenceCoordinate: number;
  readonly seawardSign: number;
};
export type Output = { readonly seawardOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shorelineCoordinate: { type: "number" },
    referenceCoordinate: { type: "number" },
    seawardSign: { type: "number" },
  },
  required: ["shorelineCoordinate", "referenceCoordinate", "seawardSign"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { seawardOffset: { type: "number" } },
  required: ["seawardOffset"],
} as const;
/** Reference a supplied shoreline transect position using an explicit seaward-positive sign convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shorelineCoordinate, referenceCoordinate, seawardSign } = request;
  const compute = (): Output => {
    H.domain(seawardSign === 1 || seawardSign === -1, "seawardSign");
    return {
      seawardOffset: (shorelineCoordinate - referenceCoordinate) * seawardSign,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shorelineCoordinate: 125, referenceCoordinate: 100, seawardSign: 1 },
  output: { seawardOffset: 25 },
} satisfies ToolExample<Input, Output>;
export const shorelineSignedTransectOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geomorphology", "earth and environmental sciences"],
      keywords: ["geomorphology", "earth and environmental sciences"],
    },
    id: "geomorphology/shoreline-signed-transect-offset",
    title: "Shoreline Signed Transect Offset",
    description:
      "Reference a supplied shoreline transect position using an explicit seaward-positive sign convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shorelineCoordinate: { type: "number" },
        referenceCoordinate: { type: "number" },
        seawardSign: { type: "number" },
      },
      required: ["shorelineCoordinate", "referenceCoordinate", "seawardSign"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { seawardOffset: { type: "number" } },
      required: ["seawardOffset"],
    },
    ports: {
      inputs: [
        {
          id: "shorelineCoordinate",
          label: "Shoreline Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceCoordinate",
          label: "Reference Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "seawardSign",
          label: "Seaward Sign",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "seawardOffset",
          label: "Seaward Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = shorelineSignedTransectOffsetTool.execute;
export default shorelineSignedTransectOffsetTool;

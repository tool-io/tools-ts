import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly scaleFactor: number;
  readonly inputConvention: string;
};
export type Output = {
  readonly physicalDistance: number;
  readonly comovingDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    scaleFactor: { type: "number", exclusiveMinimum: 0 },
    inputConvention: {
      type: "string",
      maxLength: 8192,
      enum: ["physical", "comoving"],
    },
  },
  required: ["distance", "scaleFactor", "inputConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physicalDistance: { type: "number" },
    comovingDistance: { type: "number" },
  },
  required: ["physicalDistance", "comovingDistance"],
} as const;
/** Crosswalk an explicit same-epoch physical/comoving separation using a positive scale factor without confusing luminosity or angular-diameter distances. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, scaleFactor, inputConvention } = request;
  const compute = (): Output => {
    H.domain(distance >= 0, "distance");
    (H.domain(scaleFactor > 0, "scaleFactor"), scaleFactor);
    H.domain(
      ["physical", "comoving"].includes(inputConvention),
      "inputConvention",
    );
    return inputConvention === "physical"
      ? { physicalDistance: distance, comovingDistance: distance / scaleFactor }
      : {
          physicalDistance: distance * scaleFactor,
          comovingDistance: distance,
        };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 100, scaleFactor: 0.5, inputConvention: "comoving" },
  output: { physicalDistance: 50, comovingDistance: 100 },
} satisfies ToolExample<Input, Output>;
export const cosmologyDistancePhysicalComovingLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["cosmology", "physics"],
        keywords: ["cosmology", "physics"],
      },
      id: "cosmology/cosmology-distance-physical-comoving-label",
      title: "Cosmology Distance Physical Comoving Label",
      description:
        "Crosswalk an explicit same-epoch physical/comoving separation using a positive scale factor without confusing luminosity or angular-diameter distances.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distance: { type: "number", minimum: 0 },
          scaleFactor: { type: "number", exclusiveMinimum: 0 },
          inputConvention: {
            type: "string",
            maxLength: 8192,
            enum: ["physical", "comoving"],
          },
        },
        required: ["distance", "scaleFactor", "inputConvention"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          physicalDistance: { type: "number" },
          comovingDistance: { type: "number" },
        },
        required: ["physicalDistance", "comovingDistance"],
      },
      ports: {
        inputs: [
          {
            id: "distance",
            label: "Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "scaleFactor",
            label: "Scale Factor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inputConvention",
            label: "Input Convention",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "physicalDistance",
            label: "Physical Distance",
            valueType: { type: "number" },
          },
          {
            id: "comovingDistance",
            label: "Comoving Distance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cosmologyDistancePhysicalComovingLabelTool.execute;
export default cosmologyDistancePhysicalComovingLabelTool;

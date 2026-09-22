import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly acceptedSolidAngle: number;
  readonly referenceSolidAngle: number;
  readonly throughputFraction: number;
};
export type Output = {
  readonly angularShare: number;
  readonly throughputWeightedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acceptedSolidAngle: { type: "number", minimum: 0 },
    referenceSolidAngle: { type: "number", exclusiveMinimum: 0 },
    throughputFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["acceptedSolidAngle", "referenceSolidAngle", "throughputFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angularShare: { type: "number" },
    throughputWeightedShare: { type: "number" },
  },
  required: ["angularShare", "throughputWeightedShare"],
} as const;
/** Calculate radiometer field of view share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { acceptedSolidAngle, referenceSolidAngle, throughputFraction } =
    request;
  const compute = (): Output => {
    H.domain(
      acceptedSolidAngle >= 0 && acceptedSolidAngle <= referenceSolidAngle,
    );
    H.positive(referenceSolidAngle);
    H.probability(throughputFraction);
    return {
      angularShare: acceptedSolidAngle / referenceSolidAngle,
      throughputWeightedShare:
        (acceptedSolidAngle / referenceSolidAngle) * throughputFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    acceptedSolidAngle: 1,
    referenceSolidAngle: 4,
    throughputFraction: 0.5,
  },
  output: { angularShare: 0.25, throughputWeightedShare: 0.125 },
} satisfies ToolExample<Input, Output>;
export const radiometerFieldOfViewShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/radiometer-field-of-view-share",
    title: "Radiometer Field Of View Share Tool",
    description:
      "Calculate radiometer field of view share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        acceptedSolidAngle: { type: "number", minimum: 0 },
        referenceSolidAngle: { type: "number", exclusiveMinimum: 0 },
        throughputFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "acceptedSolidAngle",
        "referenceSolidAngle",
        "throughputFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angularShare: { type: "number" },
        throughputWeightedShare: { type: "number" },
      },
      required: ["angularShare", "throughputWeightedShare"],
    },
    ports: {
      inputs: [
        {
          id: "acceptedSolidAngle",
          label: "Accepted Solid Angle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceSolidAngle",
          label: "Reference Solid Angle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "throughputFraction",
          label: "Throughput Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "angularShare",
          label: "Angular Share",
          valueType: { type: "number" },
        },
        {
          id: "throughputWeightedShare",
          label: "Throughput Weighted Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = radiometerFieldOfViewShareTool.execute;
export default radiometerFieldOfViewShareTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredVelocity: number;
  readonly angleDegrees: number;
};
export type Output = { readonly angleCorrectedVelocity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredVelocity: { type: "number" },
    angleDegrees: {
      type: "number",
      exclusiveMinimum: -90,
      exclusiveMaximum: 90,
    },
  },
  required: ["measuredVelocity", "angleDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { angleCorrectedVelocity: { type: "number" } },
  required: ["angleCorrectedVelocity"],
} as const;
/** Apply an explicit Doppler cosine correction under a supplied angle in the open interval from -90 to 90 degrees without estimating flow or recommending an angle. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredVelocity, angleDegrees } = request;
  const compute = (): Output => {
    H.domain(angleDegrees > -90 && angleDegrees < 90, "angleDegrees");
    return {
      angleCorrectedVelocity:
        measuredVelocity / Math.cos((angleDegrees * Math.PI) / 180),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredVelocity: 1, angleDegrees: 60 },
  output: { angleCorrectedVelocity: 1.9999999999999996 },
} satisfies ToolExample<Input, Output>;
export const dopplerAngleCorrectionInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["cardiology", "health and medicine"],
      keywords: ["cardiology", "health and medicine"],
    },
    id: "cardiology/doppler-angle-correction-input",
    title: "Doppler Angle Correction Input",
    description:
      "Apply an explicit Doppler cosine correction under a supplied angle in the open interval from -90 to 90 degrees without estimating flow or recommending an angle.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredVelocity: { type: "number" },
        angleDegrees: {
          type: "number",
          exclusiveMinimum: -90,
          exclusiveMaximum: 90,
        },
      },
      required: ["measuredVelocity", "angleDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { angleCorrectedVelocity: { type: "number" } },
      required: ["angleCorrectedVelocity"],
    },
    ports: {
      inputs: [
        {
          id: "measuredVelocity",
          label: "Measured Velocity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleDegrees",
          label: "Angle Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "angleCorrectedVelocity",
          label: "Angle Corrected Velocity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dopplerAngleCorrectionInputTool.execute;
export default dopplerAngleCorrectionInputTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly redshiftOffset: number;
  readonly referenceRedshift: number;
  readonly suppliedLightSpeed: number;
};
export type Output = { readonly approximateVelocity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    redshiftOffset: { type: "number" },
    referenceRedshift: { type: "number", exclusiveMinimum: -1 },
    suppliedLightSpeed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["redshiftOffset", "referenceRedshift", "suppliedLightSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { approximateVelocity: { type: "number" } },
  required: ["approximateVelocity"],
} as const;
/** Apply the small-offset convention delta-v=c delta-z/(1+z_ref), without treating cosmological redshift as an exact recession velocity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { redshiftOffset, referenceRedshift, suppliedLightSpeed } = request;
  const compute = (): Output => {
    H.domain(referenceRedshift > -1, "referenceRedshift");
    (H.domain(
      Number.isFinite(suppliedLightSpeed) && suppliedLightSpeed > 0,
      "suppliedLightSpeed",
    ),
      suppliedLightSpeed);
    return {
      approximateVelocity:
        (suppliedLightSpeed * redshiftOffset) / (1 + referenceRedshift),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    redshiftOffset: 0.001,
    referenceRedshift: 1,
    suppliedLightSpeed: 300000,
  },
  output: { approximateVelocity: 150 },
} satisfies ToolExample<Input, Output>;
export const redshiftVelocitySmallOffsetConventionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["cosmology", "physics"],
        keywords: ["cosmology", "physics"],
      },
      id: "cosmology/redshift-velocity-small-offset-convention",
      title: "Redshift Velocity Small Offset Convention",
      description:
        "Apply the small-offset convention delta-v=c delta-z/(1+z_ref), without treating cosmological redshift as an exact recession velocity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          redshiftOffset: { type: "number" },
          referenceRedshift: { type: "number", exclusiveMinimum: -1 },
          suppliedLightSpeed: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["redshiftOffset", "referenceRedshift", "suppliedLightSpeed"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { approximateVelocity: { type: "number" } },
        required: ["approximateVelocity"],
      },
      ports: {
        inputs: [
          {
            id: "redshiftOffset",
            label: "Redshift Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceRedshift",
            label: "Reference Redshift",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedLightSpeed",
            label: "Supplied Light Speed",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "approximateVelocity",
            label: "Approximate Velocity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = redshiftVelocitySmallOffsetConventionTool.execute;
export default redshiftVelocitySmallOffsetConventionTool;

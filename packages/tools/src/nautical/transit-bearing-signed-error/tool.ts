import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceBearingDegrees: number;
  readonly observedBearingDegrees: number;
};
export type Output = { readonly signedErrorDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceBearingDegrees: { type: "number" },
    observedBearingDegrees: { type: "number" },
  },
  required: ["referenceBearingDegrees", "observedBearingDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedErrorDegrees: { type: "number" } },
  required: ["signedErrorDegrees"],
} as const;
/** Compare explicit observed and reference bearings using shortest signed clockwise-positive error with a positive half-turn tie. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceBearingDegrees, observedBearingDegrees } = request;
  const compute = (): Output => {
    return {
      signedErrorDegrees: (() => {
        const raw =
          ((observedBearingDegrees % 360) - (referenceBearingDegrees % 360)) %
          360;
        return raw > 180 ? raw - 360 : raw <= -180 ? raw + 360 : raw;
      })(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceBearingDegrees: 350, observedBearingDegrees: 10 },
  output: { signedErrorDegrees: 20 },
} satisfies ToolExample<Input, Output>;
export const transitBearingSignedErrorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["nautical", "engineering"],
      keywords: ["nautical", "engineering"],
    },
    id: "nautical/transit-bearing-signed-error",
    title: "Transit Bearing Signed Error",
    description:
      "Compare explicit observed and reference bearings using shortest signed clockwise-positive error with a positive half-turn tie.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceBearingDegrees: { type: "number" },
        observedBearingDegrees: { type: "number" },
      },
      required: ["referenceBearingDegrees", "observedBearingDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedErrorDegrees: { type: "number" } },
      required: ["signedErrorDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "referenceBearingDegrees",
          label: "Reference Bearing Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedBearingDegrees",
          label: "Observed Bearing Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedErrorDegrees",
          label: "Signed Error Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = transitBearingSignedErrorTool.execute;
export default transitBearingSignedErrorTool;

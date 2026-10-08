import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly uniformRadiance: number;
  readonly suppliedProjectedSolidAngleSteradians: number;
};
export type Output = { readonly irradiance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniformRadiance: { type: "number", minimum: 0 },
    suppliedProjectedSolidAngleSteradians: { type: "number", minimum: 0 },
  },
  required: ["uniformRadiance", "suppliedProjectedSolidAngleSteradians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { irradiance: { type: "number" } },
  required: ["irradiance"],
} as const;
/** Apply a supplied cosine-projected solid angle to explicit uniform radiance without assuming an angular distribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { uniformRadiance, suppliedProjectedSolidAngleSteradians } = request;
  const compute = (): Output => {
    H.domain(
      uniformRadiance >= 0 && suppliedProjectedSolidAngleSteradians >= 0,
      "uniformRadiance",
    );
    return {
      irradiance: uniformRadiance * suppliedProjectedSolidAngleSteradians,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { uniformRadiance: 5, suppliedProjectedSolidAngleSteradians: 2 },
  output: { irradiance: 10 },
} satisfies ToolExample<Input, Output>;
export const radianceIrradianceSolidAngleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["convert", "unit conversion", "computer science"],
      keywords: ["unit conversion", "computer science"],
    },
    id: "convert/radiance-irradiance-solid-angle-factor",
    title: "Radiance Irradiance Solid Angle Factor",
    description:
      "Apply a supplied cosine-projected solid angle to explicit uniform radiance without assuming an angular distribution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniformRadiance: { type: "number", minimum: 0 },
        suppliedProjectedSolidAngleSteradians: { type: "number", minimum: 0 },
      },
      required: ["uniformRadiance", "suppliedProjectedSolidAngleSteradians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { irradiance: { type: "number" } },
      required: ["irradiance"],
    },
    ports: {
      inputs: [
        {
          id: "uniformRadiance",
          label: "Uniform Radiance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedProjectedSolidAngleSteradians",
          label: "Supplied Projected Solid Angle Steradians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "irradiance",
          label: "Irradiance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = radianceIrradianceSolidAngleFactorTool.execute;
export default radianceIrradianceSolidAngleFactorTool;

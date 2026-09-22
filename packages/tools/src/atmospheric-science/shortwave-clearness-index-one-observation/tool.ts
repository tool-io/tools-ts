import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surfaceIrradiance: number;
  readonly extraterrestrialHorizontal: number;
};
export type Output = { readonly index: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surfaceIrradiance: { type: "number", minimum: 0 },
    extraterrestrialHorizontal: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["surfaceIrradiance", "extraterrestrialHorizontal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { index: { type: "number" } },
  required: ["index"],
} as const;
/** Calculate shortwave clearness index one observation from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surfaceIrradiance, extraterrestrialHorizontal } = request;
  const compute = (): Output => {
    H.domain(surfaceIrradiance >= 0);
    H.positive(extraterrestrialHorizontal);
    return { index: surfaceIrradiance / extraterrestrialHorizontal };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { surfaceIrradiance: 600, extraterrestrialHorizontal: 1000 },
  output: { index: 0.6 },
} satisfies ToolExample<Input, Output>;
export const shortwaveClearnessIndexOneObservationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-science/shortwave-clearness-index-one-observation",
      title: "Shortwave Clearness Index One Observation Tool",
      description:
        "Calculate shortwave clearness index one observation from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          surfaceIrradiance: { type: "number", minimum: 0 },
          extraterrestrialHorizontal: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["surfaceIrradiance", "extraterrestrialHorizontal"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { index: { type: "number" } },
        required: ["index"],
      },
      ports: {
        inputs: [
          {
            id: "surfaceIrradiance",
            label: "Surface Irradiance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "extraterrestrialHorizontal",
            label: "Extraterrestrial Horizontal",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "index", label: "Index", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = shortwaveClearnessIndexOneObservationTool.execute;
export default shortwaveClearnessIndexOneObservationTool;

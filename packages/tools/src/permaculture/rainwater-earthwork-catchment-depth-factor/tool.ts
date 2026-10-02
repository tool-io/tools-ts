import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly areaM2: number;
  readonly depthMm: number;
  readonly captureFraction: number;
};
export type Output = { readonly capturedLiters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaM2: { type: "number", minimum: 0 },
    depthMm: { type: "number", minimum: 0 },
    captureFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["areaM2", "depthMm", "captureFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { capturedLiters: { type: "number" } },
  required: ["capturedLiters"],
} as const;
/** Calculate rainwater earthwork catchment depth factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { areaM2, depthMm, captureFraction } = request;
  const compute = (): Output => {
    H.domain(areaM2 >= 0 && depthMm >= 0);
    H.probability(captureFraction);
    return { capturedLiters: areaM2 * depthMm * captureFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { areaM2: 100, depthMm: 10, captureFraction: 0.8 },
  output: { capturedLiters: 800 },
} satisfies ToolExample<Input, Output>;
export const rainwaterEarthworkCatchmentDepthFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "permaculture/rainwater-earthwork-catchment-depth-factor",
      title: "Rainwater Earthwork Catchment Depth Factor Tool",
      description:
        "Calculate rainwater earthwork catchment depth factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          areaM2: { type: "number", minimum: 0 },
          depthMm: { type: "number", minimum: 0 },
          captureFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["areaM2", "depthMm", "captureFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { capturedLiters: { type: "number" } },
        required: ["capturedLiters"],
      },
      ports: {
        inputs: [
          {
            id: "areaM2",
            label: "Area M2",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "depthMm",
            label: "Depth Mm",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "captureFraction",
            label: "Capture Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
        ],
        outputs: [
          {
            id: "capturedLiters",
            label: "Captured Liters",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = rainwaterEarthworkCatchmentDepthFactorTool.execute;
export default rainwaterEarthworkCatchmentDepthFactorTool;

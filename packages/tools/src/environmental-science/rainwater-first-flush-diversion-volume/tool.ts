import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly catchmentArea: number;
  readonly flushDepth: number;
  readonly runoffFraction: number;
};
export type Output = { readonly diversionVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    catchmentArea: { type: "number", minimum: 0 },
    flushDepth: { type: "number", minimum: 0 },
    runoffFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["catchmentArea", "flushDepth", "runoffFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { diversionVolume: { type: "number" } },
  required: ["diversionVolume"],
} as const;
/** Calculate rainwater first flush diversion volume from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { catchmentArea, flushDepth, runoffFraction } = request;
  const compute = (): Output => {
    H.domain(catchmentArea >= 0 && flushDepth >= 0);
    H.probability(runoffFraction);
    return { diversionVolume: catchmentArea * flushDepth * runoffFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { catchmentArea: 100, flushDepth: 0.001, runoffFraction: 0.8 },
  output: { diversionVolume: 0.08000000000000002 },
} satisfies ToolExample<Input, Output>;
export const rainwaterFirstFlushDiversionVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/rainwater-first-flush-diversion-volume",
    title: "Rainwater First Flush Diversion Volume Tool",
    description:
      "Calculate rainwater first flush diversion volume from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        catchmentArea: { type: "number", minimum: 0 },
        flushDepth: { type: "number", minimum: 0 },
        runoffFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["catchmentArea", "flushDepth", "runoffFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { diversionVolume: { type: "number" } },
      required: ["diversionVolume"],
    },
    ports: {
      inputs: [
        {
          id: "catchmentArea",
          label: "Catchment Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "flushDepth",
          label: "Flush Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "runoffFraction",
          label: "Runoff Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "diversionVolume",
          label: "Diversion Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rainwaterFirstFlushDiversionVolumeTool.execute;
export default rainwaterFirstFlushDiversionVolumeTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volumes: readonly number[];
  readonly concentrations: readonly number[];
};
export type Output = {
  readonly totalVolume: number;
  readonly concentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumes: { type: "array", maxItems: 256, items: { type: "number" } },
    concentrations: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["volumes", "concentrations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalVolume: { type: "number" },
    concentration: { type: "number" },
  },
  required: ["totalVolume", "concentration"],
} as const;
/** Compute an additive-volume mixture concentration from an explicit intake log; no intake recommendation is produced. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volumes, concentrations } = request;
  const compute = (): Output => {
    H.sameLength(volumes, concentrations);
    H.domain(
      volumes.every((x) => x >= 0) && concentrations.every((x) => x >= 0),
    );
    const totalVolume = volumes.reduce((a, b) => a + b, 0);
    H.positive(totalVolume);
    return {
      totalVolume,
      concentration: H.dot(volumes, concentrations) / totalVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volumes: [200, 300], concentrations: [2, 4] },
  output: { totalVolume: 500, concentration: 3.2 },
} satisfies ToolExample<Input, Output>;
export const hydrationLogConcentrationMixedVolumeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health/hydration-log-concentration-mixed-volume",
      title: "Hydration Log Concentration Mixed Volume Tool",
      description:
        "Compute an additive-volume mixture concentration from an explicit intake log; no intake recommendation is produced.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          volumes: { type: "array", maxItems: 256, items: { type: "number" } },
          concentrations: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["volumes", "concentrations"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalVolume: { type: "number" },
          concentration: { type: "number" },
        },
        required: ["totalVolume", "concentration"],
      },
      ports: {
        inputs: [
          {
            id: "volumes",
            label: "Volumes",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "concentrations",
            label: "Concentrations",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "totalVolume",
            label: "Total Volume",
            valueType: { type: "number" },
          },
          {
            id: "concentration",
            label: "Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hydrationLogConcentrationMixedVolumeTool.execute;
export default hydrationLogConcentrationMixedVolumeTool;

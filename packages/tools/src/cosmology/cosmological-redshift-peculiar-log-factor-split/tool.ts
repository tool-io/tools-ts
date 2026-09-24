import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cosmologicalRedshift: number;
  readonly peculiarRedshift: number;
};
export type Output = {
  readonly combinedRedshift: number;
  readonly logCosmologicalFactor: number;
  readonly logPeculiarFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cosmologicalRedshift: { type: "number", exclusiveMinimum: -1 },
    peculiarRedshift: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["cosmologicalRedshift", "peculiarRedshift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    combinedRedshift: { type: "number" },
    logCosmologicalFactor: { type: "number" },
    logPeculiarFactor: { type: "number" },
  },
  required: ["combinedRedshift", "logCosmologicalFactor", "logPeculiarFactor"],
} as const;
/** Compose redshift factors multiplicatively rather than adding redshifts; no peculiar-velocity approximation is applied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cosmologicalRedshift, peculiarRedshift } = request;
  const compute = (): Output => {
    H.domain(cosmologicalRedshift > -1 && peculiarRedshift > -1);
    return {
      combinedRedshift: (1 + cosmologicalRedshift) * (1 + peculiarRedshift) - 1,
      logCosmologicalFactor: Math.log1p(cosmologicalRedshift),
      logPeculiarFactor: Math.log1p(peculiarRedshift),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cosmologicalRedshift: 1, peculiarRedshift: 0.1 },
  output: {
    combinedRedshift: 1.2000000000000002,
    logCosmologicalFactor: 0.6931471805599453,
    logPeculiarFactor: 0.09531017980432487,
  },
} satisfies ToolExample<Input, Output>;
export const cosmologicalRedshiftPeculiarLogFactorSplitTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cosmology/cosmological-redshift-peculiar-log-factor-split",
      title: "Cosmological Redshift Peculiar Log Factor Split Tool",
      description:
        "Compose redshift factors multiplicatively rather than adding redshifts; no peculiar-velocity approximation is applied.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cosmologicalRedshift: { type: "number", exclusiveMinimum: -1 },
          peculiarRedshift: { type: "number", exclusiveMinimum: -1 },
        },
        required: ["cosmologicalRedshift", "peculiarRedshift"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          combinedRedshift: { type: "number" },
          logCosmologicalFactor: { type: "number" },
          logPeculiarFactor: { type: "number" },
        },
        required: [
          "combinedRedshift",
          "logCosmologicalFactor",
          "logPeculiarFactor",
        ],
      },
      ports: {
        inputs: [
          {
            id: "cosmologicalRedshift",
            label: "Cosmological Redshift",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "peculiarRedshift",
            label: "Peculiar Redshift",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "combinedRedshift",
            label: "Combined Redshift",
            valueType: { type: "number" },
          },
          {
            id: "logCosmologicalFactor",
            label: "Log Cosmological Factor",
            valueType: { type: "number" },
          },
          {
            id: "logPeculiarFactor",
            label: "Log Peculiar Factor",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cosmologicalRedshiftPeculiarLogFactorSplitTool.execute;
export default cosmologicalRedshiftPeculiarLogFactorSplitTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coveredDuration: number;
  readonly eligibleDuration: number;
};
export type Output = { readonly fraction: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredDuration: { type: "number", minimum: 0 },
    eligibleDuration: { type: "number", minimum: 0 },
  },
  required: ["coveredDuration", "eligibleDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, defined: { type: "boolean" } },
  required: ["fraction", "defined"],
} as const;
/** Calculate soil cover duration fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coveredDuration, eligibleDuration } = request;
  const compute = (): Output => {
    H.domain(
      eligibleDuration >= 0 &&
        coveredDuration >= 0 &&
        coveredDuration <= eligibleDuration,
    );
    return {
      fraction: eligibleDuration > 0 ? coveredDuration / eligibleDuration : 0,
      defined: eligibleDuration > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coveredDuration: 15, eligibleDuration: 20 },
  output: { fraction: 0.75, defined: true },
} satisfies ToolExample<Input, Output>;
export const soilCoverDurationFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/soil-cover-duration-fraction",
    title: "Soil Cover Duration Fraction Tool",
    description:
      "Calculate soil cover duration fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredDuration: { type: "number", minimum: 0 },
        eligibleDuration: { type: "number", minimum: 0 },
      },
      required: ["coveredDuration", "eligibleDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["fraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "coveredDuration",
          label: "Covered Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eligibleDuration",
          label: "Eligible Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = soilCoverDurationFractionTool.execute;
export default soilCoverDurationFractionTool;

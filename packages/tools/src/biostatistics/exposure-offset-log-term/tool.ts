import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exposure: number;
  readonly suppliedReferenceExposure: number;
};
export type Output = {
  readonly logOffset: number;
  readonly exposureRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposure: { type: "number", exclusiveMinimum: 0 },
    suppliedReferenceExposure: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["exposure", "suppliedReferenceExposure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logOffset: { type: "number" },
    exposureRatio: { type: "number" },
  },
  required: ["logOffset", "exposureRatio"],
} as const;
/** Return one log exposure offset relative to an explicit reference unit, without fitting a count model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exposure, suppliedReferenceExposure } = request;
  const compute = (): Output => {
    H.positive(exposure);
    H.positive(suppliedReferenceExposure);
    return {
      logOffset: Math.log(exposure) - Math.log(suppliedReferenceExposure),
      exposureRatio: exposure / suppliedReferenceExposure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exposure: 20, suppliedReferenceExposure: 5 },
  output: { logOffset: 1.3862943611198906, exposureRatio: 4 },
} satisfies ToolExample<Input, Output>;
export const exposureOffsetLogTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biostatistics/exposure-offset-log-term",
    title: "Exposure Offset Log Term Tool",
    description:
      "Return one log exposure offset relative to an explicit reference unit, without fitting a count model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposure: { type: "number", exclusiveMinimum: 0 },
        suppliedReferenceExposure: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["exposure", "suppliedReferenceExposure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logOffset: { type: "number" },
        exposureRatio: { type: "number" },
      },
      required: ["logOffset", "exposureRatio"],
    },
    ports: {
      inputs: [
        {
          id: "exposure",
          label: "Exposure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceExposure",
          label: "Supplied Reference Exposure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "logOffset", label: "Log Offset", valueType: { type: "number" } },
        {
          id: "exposureRatio",
          label: "Exposure Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exposureOffsetLogTermTool.execute;
export default exposureOffsetLogTermTool;

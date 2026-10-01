import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly unprotectedDb: number;
  readonly protectedDb: number;
  readonly referencePressure: number;
};
export type Output = {
  readonly insertionLossDb: number;
  readonly pressureRatio: number;
  readonly protectedPressure: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unprotectedDb: { type: "number" },
    protectedDb: { type: "number" },
    referencePressure: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["unprotectedDb", "protectedDb", "referencePressure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    insertionLossDb: { type: "number" },
    pressureRatio: { type: "number" },
    protectedPressure: { type: "number" },
  },
  required: ["insertionLossDb", "pressureRatio", "protectedPressure"],
} as const;
/** Compare supplied bench sound-pressure levels without estimating wearer protection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unprotectedDb, protectedDb, referencePressure } = request;
  const compute = (): Output => {
    H.positive(referencePressure);
    return {
      insertionLossDb: unprotectedDb - protectedDb,
      pressureRatio: 10 ** ((unprotectedDb - protectedDb) / 20),
      protectedPressure: referencePressure * 10 ** (protectedDb / 20),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { unprotectedDb: 90, protectedDb: 70, referencePressure: 0.00002 },
  output: {
    insertionLossDb: 20,
    pressureRatio: 10,
    protectedPressure: 0.0632455532033676,
  },
} satisfies ToolExample<Input, Output>;
export const hearingProtectorBenchLevelGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-health/hearing-protector-bench-level-gap",
    title: "Hearing Protector Bench Level Gap Tool",
    description:
      "Compare supplied bench sound-pressure levels without estimating wearer protection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unprotectedDb: { type: "number" },
        protectedDb: { type: "number" },
        referencePressure: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["unprotectedDb", "protectedDb", "referencePressure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        insertionLossDb: { type: "number" },
        pressureRatio: { type: "number" },
        protectedPressure: { type: "number" },
      },
      required: ["insertionLossDb", "pressureRatio", "protectedPressure"],
    },
    ports: {
      inputs: [
        {
          id: "unprotectedDb",
          label: "Unprotected Db",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "protectedDb",
          label: "Protected Db",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePressure",
          label: "Reference Pressure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "insertionLossDb",
          label: "Insertion Loss Db",
          valueType: { type: "number" },
        },
        {
          id: "pressureRatio",
          label: "Pressure Ratio",
          valueType: { type: "number" },
        },
        {
          id: "protectedPressure",
          label: "Protected Pressure",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hearingProtectorBenchLevelGapTool.execute;
export default hearingProtectorBenchLevelGapTool;

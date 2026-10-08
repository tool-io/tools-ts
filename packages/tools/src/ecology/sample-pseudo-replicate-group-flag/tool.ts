import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstSampleId: string;
  readonly secondSampleId: string;
  readonly firstUnitId: string;
  readonly secondUnitId: string;
};
export type Output = {
  readonly sameSample: boolean;
  readonly sharesSamplingUnit: boolean;
  readonly distinctSamplesShareUnit: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSampleId: { type: "string", maxLength: 8192, minLength: 1 },
    secondSampleId: { type: "string", maxLength: 8192, minLength: 1 },
    firstUnitId: { type: "string", maxLength: 8192, minLength: 1 },
    secondUnitId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["firstSampleId", "secondSampleId", "firstUnitId", "secondUnitId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameSample: { type: "boolean" },
    sharesSamplingUnit: { type: "boolean" },
    distinctSamplesShareUnit: { type: "boolean" },
  },
  required: ["sameSample", "sharesSamplingUnit", "distinctSamplesShareUnit"],
} as const;
/** Flag distinct sample identifiers sharing an explicit sampling-unit identifier without deciding statistical independence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstSampleId, secondSampleId, firstUnitId, secondUnitId } = request;
  const compute = (): Output => {
    H.domain(
      firstSampleId.length > 0 &&
        secondSampleId.length > 0 &&
        firstUnitId.length > 0 &&
        secondUnitId.length > 0,
      "firstSampleId",
    );
    return {
      sameSample: firstSampleId === secondSampleId,
      sharesSamplingUnit: firstUnitId === secondUnitId,
      distinctSamplesShareUnit:
        firstSampleId !== secondSampleId && firstUnitId === secondUnitId,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstSampleId: "S1",
    secondSampleId: "S2",
    firstUnitId: "P1",
    secondUnitId: "P1",
  },
  output: {
    sameSample: false,
    sharesSamplingUnit: true,
    distinctSamplesShareUnit: true,
  },
} satisfies ToolExample<Input, Output>;
export const samplePseudoReplicateGroupFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["ecology", "biology"],
      keywords: ["ecology", "biology"],
    },
    id: "ecology/sample-pseudo-replicate-group-flag",
    title: "Sample Pseudo Replicate Group Flag",
    description:
      "Flag distinct sample identifiers sharing an explicit sampling-unit identifier without deciding statistical independence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstSampleId: { type: "string", maxLength: 8192, minLength: 1 },
        secondSampleId: { type: "string", maxLength: 8192, minLength: 1 },
        firstUnitId: { type: "string", maxLength: 8192, minLength: 1 },
        secondUnitId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: [
        "firstSampleId",
        "secondSampleId",
        "firstUnitId",
        "secondUnitId",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameSample: { type: "boolean" },
        sharesSamplingUnit: { type: "boolean" },
        distinctSamplesShareUnit: { type: "boolean" },
      },
      required: [
        "sameSample",
        "sharesSamplingUnit",
        "distinctSamplesShareUnit",
      ],
    },
    ports: {
      inputs: [
        {
          id: "firstSampleId",
          label: "First Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondSampleId",
          label: "Second Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstUnitId",
          label: "First Unit Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondUnitId",
          label: "Second Unit Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "sameSample",
          label: "Same Sample",
          valueType: { type: "boolean" },
        },
        {
          id: "sharesSamplingUnit",
          label: "Shares Sampling Unit",
          valueType: { type: "boolean" },
        },
        {
          id: "distinctSamplesShareUnit",
          label: "Distinct Samples Share Unit",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = samplePseudoReplicateGroupFlagTool.execute;
export default samplePseudoReplicateGroupFlagTool;

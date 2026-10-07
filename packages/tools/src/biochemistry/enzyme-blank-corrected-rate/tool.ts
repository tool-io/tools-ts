import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleSignalChange: number;
  readonly blankSignalChange: number;
  readonly elapsedMinutes: number;
};
export type Output = {
  readonly correctedSignalChange: number;
  readonly correctedRatePerMinute: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSignalChange: { type: "number" },
    blankSignalChange: { type: "number" },
    elapsedMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sampleSignalChange", "blankSignalChange", "elapsedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedSignalChange: { type: "number" },
    correctedRatePerMinute: { type: "number" },
  },
  required: ["correctedSignalChange", "correctedRatePerMinute"],
} as const;
/** Subtract a matched blank signal change and divide by an explicitly observed interval without choosing an enzyme assay protocol. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleSignalChange, blankSignalChange, elapsedMinutes } = request;
  const compute = (): Output => {
    (H.domain(elapsedMinutes > 0, "elapsedMinutes"), elapsedMinutes);
    return {
      correctedSignalChange: sampleSignalChange - blankSignalChange,
      correctedRatePerMinute:
        (sampleSignalChange - blankSignalChange) / elapsedMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleSignalChange: 0.3, blankSignalChange: 0.1, elapsedMinutes: 2 },
  output: {
    correctedSignalChange: 0.19999999999999998,
    correctedRatePerMinute: 0.09999999999999999,
  },
} satisfies ToolExample<Input, Output>;
export const enzymeBlankCorrectedRateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biochemistry", "biology"],
      keywords: ["biochemistry", "biology"],
    },
    id: "biochemistry/enzyme-blank-corrected-rate",
    title: "Enzyme Blank Corrected Rate",
    description:
      "Subtract a matched blank signal change and divide by an explicitly observed interval without choosing an enzyme assay protocol.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleSignalChange: { type: "number" },
        blankSignalChange: { type: "number" },
        elapsedMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sampleSignalChange", "blankSignalChange", "elapsedMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedSignalChange: { type: "number" },
        correctedRatePerMinute: { type: "number" },
      },
      required: ["correctedSignalChange", "correctedRatePerMinute"],
    },
    ports: {
      inputs: [
        {
          id: "sampleSignalChange",
          label: "Sample Signal Change",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankSignalChange",
          label: "Blank Signal Change",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedMinutes",
          label: "Elapsed Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedSignalChange",
          label: "Corrected Signal Change",
          valueType: { type: "number" },
        },
        {
          id: "correctedRatePerMinute",
          label: "Corrected Rate Per Minute",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = enzymeBlankCorrectedRateTool.execute;
export default enzymeBlankCorrectedRateTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedSeconds: number;
  readonly artifactSeconds: number;
};
export type Output = {
  readonly analyzableSeconds: number;
  readonly analyzableFraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedSeconds: { type: "number", minimum: 0 },
    artifactSeconds: { type: "number", minimum: 0 },
  },
  required: ["recordedSeconds", "artifactSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    analyzableSeconds: { type: "number" },
    analyzableFraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["analyzableSeconds", "analyzableFraction", "defined"],
} as const;
/** Subtract explicitly marked artifact duration and normalize the remainder without assessing a cardiac recording. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedSeconds, artifactSeconds } = request;
  const compute = (): Output => {
    H.domain(
      recordedSeconds >= 0 &&
        artifactSeconds >= 0 &&
        artifactSeconds <= recordedSeconds,
      "recordedSeconds",
    );
    return {
      analyzableSeconds: recordedSeconds - artifactSeconds,
      analyzableFraction:
        recordedSeconds > 0
          ? (recordedSeconds - artifactSeconds) / recordedSeconds
          : 0,
      defined: recordedSeconds > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedSeconds: 3600, artifactSeconds: 600 },
  output: {
    analyzableSeconds: 3000,
    analyzableFraction: 0.8333333333333334,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const cardiacMonitorAnalyzabletimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["cardiology", "health and medicine"],
      keywords: ["cardiology", "health and medicine"],
    },
    id: "cardiology/cardiac-monitor-analyzable-time-share",
    title: "Cardiac Monitor Analyzable Time Share",
    description:
      "Subtract explicitly marked artifact duration and normalize the remainder without assessing a cardiac recording.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedSeconds: { type: "number", minimum: 0 },
        artifactSeconds: { type: "number", minimum: 0 },
      },
      required: ["recordedSeconds", "artifactSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        analyzableSeconds: { type: "number" },
        analyzableFraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["analyzableSeconds", "analyzableFraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "recordedSeconds",
          label: "Recorded Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "artifactSeconds",
          label: "Artifact Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "analyzableSeconds",
          label: "Analyzable Seconds",
          valueType: { type: "number" },
        },
        {
          id: "analyzableFraction",
          label: "Analyzable Fraction",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = cardiacMonitorAnalyzabletimeShareTool.execute;
export default cardiacMonitorAnalyzabletimeShareTool;

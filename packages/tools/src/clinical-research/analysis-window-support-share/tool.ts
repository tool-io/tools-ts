import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly durations: readonly number[];
  readonly inAnalysisWindow: readonly boolean[];
  readonly outcomeKnown: readonly boolean[];
  readonly covariatesKnown: readonly boolean[];
};
export type Output = {
  readonly analysisDuration: number;
  readonly supportedDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    inAnalysisWindow: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    outcomeKnown: { type: "array", maxItems: 256, items: { type: "boolean" } },
    covariatesKnown: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "durations",
    "inAnalysisWindow",
    "outcomeKnown",
    "covariatesKnown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    analysisDuration: { type: "number" },
    supportedDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["analysisDuration", "supportedDuration", "share", "defined"],
} as const;
/** Calculate analysis window support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { durations, inAnalysisWindow, outcomeKnown, covariatesKnown } =
    request;
  const compute = (): Output => {
    H.sameLength(durations, inAnalysisWindow);
    H.sameLength(durations, outcomeKnown);
    H.sameLength(durations, covariatesKnown);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const analysisDuration = durations.reduce(
          (s, x, i) => s + (inAnalysisWindow[i] ? x : 0),
          0,
        ),
        supportedDuration = durations.reduce(
          (s, x, i) =>
            s +
            (inAnalysisWindow[i] && outcomeKnown[i] && covariatesKnown[i]
              ? x
              : 0),
          0,
        );
      return {
        analysisDuration,
        supportedDuration,
        share: analysisDuration > 0 ? supportedDuration / analysisDuration : 0,
        defined: analysisDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    durations: [2, 3, 5],
    inAnalysisWindow: [true, true, false],
    outcomeKnown: [true, true, true],
    covariatesKnown: [true, false, true],
  },
  output: {
    analysisDuration: 5,
    supportedDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const analysisWindowSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-research/analysis-window-support-share",
    title: "Analysis Window Support Share Tool",
    description:
      "Calculate analysis window support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        inAnalysisWindow: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        outcomeKnown: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        covariatesKnown: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "durations",
        "inAnalysisWindow",
        "outcomeKnown",
        "covariatesKnown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        analysisDuration: { type: "number" },
        supportedDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["analysisDuration", "supportedDuration", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "inAnalysisWindow",
          label: "In Analysis Window",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "outcomeKnown",
          label: "Outcome Known",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "covariatesKnown",
          label: "Covariates Known",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "analysisDuration",
          label: "Analysis Duration",
          valueType: { type: "number" },
        },
        {
          id: "supportedDuration",
          label: "Supported Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = analysisWindowSupportShareTool.execute;
export default analysisWindowSupportShareTool;

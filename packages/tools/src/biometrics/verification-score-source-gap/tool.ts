import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scores: readonly number[];
  readonly sourceScores: readonly number[];
  readonly modelVersions: readonly string[];
  readonly requiredVersion: string;
};
export type Output = {
  readonly scoreResiduals: readonly number[];
  readonly versionMismatches: number;
  readonly maximumAbsoluteResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scores: { type: "array", maxItems: 256, items: { type: "number" } },
    sourceScores: { type: "array", maxItems: 256, items: { type: "number" } },
    modelVersions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredVersion: { type: "string", maxLength: 8192 },
  },
  required: ["scores", "sourceScores", "modelVersions", "requiredVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scoreResiduals: { type: "array", maxItems: 256, items: { type: "number" } },
    versionMismatches: { type: "integer" },
    maximumAbsoluteResidual: { type: "number" },
  },
  required: ["scoreResiduals", "versionMismatches", "maximumAbsoluteResidual"],
} as const;
/** Calculate verification score source gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scores, sourceScores, modelVersions, requiredVersion } = request;
  const compute = (): Output => {
    H.sameLength(scores, sourceScores);
    H.sameLength(scores, modelVersions);
    return (() => {
      const scoreResiduals = scores.map((x, i) => x - sourceScores[i]);
      return {
        scoreResiduals,
        versionMismatches: modelVersions.filter((x) => x !== requiredVersion)
          .length,
        maximumAbsoluteResidual: Math.max(0, ...scoreResiduals.map(Math.abs)),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scores: [2, 4],
    sourceScores: [1, 4],
    modelVersions: ["v2", "v1"],
    requiredVersion: "v2",
  },
  output: {
    scoreResiduals: [1, 0],
    versionMismatches: 1,
    maximumAbsoluteResidual: 1,
  },
} satisfies ToolExample<Input, Output>;
export const verificationScoreSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biometrics/verification-score-source-gap",
    title: "Verification Score Source Gap Tool",
    description:
      "Calculate verification score source gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scores: { type: "array", maxItems: 256, items: { type: "number" } },
        sourceScores: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        modelVersions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredVersion: { type: "string", maxLength: 8192 },
      },
      required: ["scores", "sourceScores", "modelVersions", "requiredVersion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scoreResiduals: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        versionMismatches: { type: "integer" },
        maximumAbsoluteResidual: { type: "number" },
      },
      required: [
        "scoreResiduals",
        "versionMismatches",
        "maximumAbsoluteResidual",
      ],
    },
    ports: {
      inputs: [
        {
          id: "scores",
          label: "Scores",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sourceScores",
          label: "Source Scores",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "modelVersions",
          label: "Model Versions",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requiredVersion",
          label: "Required Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "scoreResiduals",
          label: "Score Residuals",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "versionMismatches",
          label: "Version Mismatches",
          valueType: { type: "integer" },
        },
        {
          id: "maximumAbsoluteResidual",
          label: "Maximum Absolute Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = verificationScoreSourceGapTool.execute;
export default verificationScoreSourceGapTool;

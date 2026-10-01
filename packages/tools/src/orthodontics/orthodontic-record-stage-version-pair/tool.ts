import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stage: number;
  readonly version: number;
  readonly parentStage: number;
  readonly parentVersion: number;
  readonly sameCase: boolean;
};
export type Output = {
  readonly sameStage: boolean;
  readonly laterVersion: boolean;
  readonly followsParent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stage: { type: "integer", minimum: 0 },
    version: { type: "integer", minimum: 0 },
    parentStage: { type: "integer", minimum: 0 },
    parentVersion: { type: "integer", minimum: 0 },
    sameCase: { type: "boolean" },
  },
  required: ["stage", "version", "parentStage", "parentVersion", "sameCase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameStage: { type: "boolean" },
    laterVersion: { type: "boolean" },
    followsParent: { type: "boolean" },
  },
  required: ["sameStage", "laterVersion", "followsParent"],
} as const;
/** Check supplied model stage/version succession within an explicit case match. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stage, version, parentStage, parentVersion, sameCase } = request;
  const compute = (): Output => {
    H.integer(stage, 0);
    H.integer(version, 0);
    H.integer(parentStage, 0);
    H.integer(parentVersion, 0);
    return {
      sameStage: stage === parentStage,
      laterVersion: version > parentVersion,
      followsParent:
        sameCase &&
        (stage > parentStage ||
          (stage === parentStage && version > parentVersion)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stage: 2,
    version: 3,
    parentStage: 2,
    parentVersion: 2,
    sameCase: true,
  },
  output: { sameStage: true, laterVersion: true, followsParent: true },
} satisfies ToolExample<Input, Output>;
export const orthodonticRecordStageVersionPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthodontics/orthodontic-record-stage-version-pair",
    title: "Orthodontic Record Stage Version Pair Tool",
    description:
      "Check supplied model stage/version succession within an explicit case match.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stage: { type: "integer", minimum: 0 },
        version: { type: "integer", minimum: 0 },
        parentStage: { type: "integer", minimum: 0 },
        parentVersion: { type: "integer", minimum: 0 },
        sameCase: { type: "boolean" },
      },
      required: [
        "stage",
        "version",
        "parentStage",
        "parentVersion",
        "sameCase",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameStage: { type: "boolean" },
        laterVersion: { type: "boolean" },
        followsParent: { type: "boolean" },
      },
      required: ["sameStage", "laterVersion", "followsParent"],
    },
    ports: {
      inputs: [
        {
          id: "stage",
          label: "Stage",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "parentStage",
          label: "Parent Stage",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "parentVersion",
          label: "Parent Version",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sameCase",
          label: "Same Case",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "sameStage",
          label: "Same Stage",
          valueType: { type: "boolean" },
        },
        {
          id: "laterVersion",
          label: "Later Version",
          valueType: { type: "boolean" },
        },
        {
          id: "followsParent",
          label: "Follows Parent",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = orthodonticRecordStageVersionPairTool.execute;
export default orthodonticRecordStageVersionPairTool;

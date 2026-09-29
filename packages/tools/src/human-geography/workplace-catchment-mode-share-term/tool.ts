import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly modeWorkers: number;
  readonly classifiedWorkers: number;
  readonly unknownMode: number;
  readonly includeUnknown: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly share: number;
  readonly unknownShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modeWorkers: { type: "integer", minimum: 0 },
    classifiedWorkers: { type: "integer", minimum: 1 },
    unknownMode: { type: "integer", minimum: 0 },
    includeUnknown: { type: "boolean" },
  },
  required: [
    "modeWorkers",
    "classifiedWorkers",
    "unknownMode",
    "includeUnknown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    share: { type: "number" },
    unknownShare: { type: "number" },
  },
  required: ["denominator", "share", "unknownShare"],
} as const;
/** Calculate workplace catchment mode share term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { modeWorkers, classifiedWorkers, unknownMode, includeUnknown } =
    request;
  const compute = (): Output => {
    H.integer(classifiedWorkers, 1);
    H.integer(modeWorkers, 0, classifiedWorkers);
    H.integer(unknownMode, 0);
    return {
      denominator: classifiedWorkers + (includeUnknown ? unknownMode : 0),
      share:
        modeWorkers / (classifiedWorkers + (includeUnknown ? unknownMode : 0)),
      unknownShare: unknownMode / (classifiedWorkers + unknownMode),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    modeWorkers: 40,
    classifiedWorkers: 100,
    unknownMode: 25,
    includeUnknown: true,
  },
  output: { denominator: 125, share: 0.32, unknownShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const workplaceCatchmentModeShareTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/workplace-catchment-mode-share-term",
    title: "Workplace Catchment Mode Share Term Tool",
    description:
      "Calculate workplace catchment mode share term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modeWorkers: { type: "integer", minimum: 0 },
        classifiedWorkers: { type: "integer", minimum: 1 },
        unknownMode: { type: "integer", minimum: 0 },
        includeUnknown: { type: "boolean" },
      },
      required: [
        "modeWorkers",
        "classifiedWorkers",
        "unknownMode",
        "includeUnknown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        share: { type: "number" },
        unknownShare: { type: "number" },
      },
      required: ["denominator", "share", "unknownShare"],
    },
    ports: {
      inputs: [
        {
          id: "modeWorkers",
          label: "Mode Workers",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "classifiedWorkers",
          label: "Classified Workers",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unknownMode",
          label: "Unknown Mode",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeUnknown",
          label: "Include Unknown",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        {
          id: "unknownShare",
          label: "Unknown Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = workplaceCatchmentModeShareTermTool.execute;
export default workplaceCatchmentModeShareTermTool;

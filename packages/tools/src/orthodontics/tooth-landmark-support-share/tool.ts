import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly toothIds: readonly string[];
  readonly landmarkIds: readonly string[];
  readonly observed: readonly boolean[];
  readonly requiredLandmarks: readonly string[];
};
export type Output = {
  readonly requiredPairs: number;
  readonly supportedPairs: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    toothIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    landmarkIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    requiredLandmarks: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["toothIds", "landmarkIds", "observed", "requiredLandmarks"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredPairs: { type: "integer" },
    supportedPairs: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["requiredPairs", "supportedPairs", "share", "defined"],
} as const;
/** Calculate tooth landmark support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { toothIds, landmarkIds, observed, requiredLandmarks } = request;
  const compute = (): Output => {
    H.sameLength(toothIds, landmarkIds);
    H.sameLength(toothIds, observed);
    return (() => {
      const teeth = [...new Set(toothIds)],
        required = [...new Set(requiredLandmarks)],
        requiredPairs = teeth.length * required.length;
      let supportedPairs = 0;
      for (const t of teeth)
        for (const l of required)
          if (
            toothIds.some(
              (x, i) => x === t && landmarkIds[i] === l && observed[i],
            )
          )
            supportedPairs++;
      return {
        requiredPairs,
        supportedPairs,
        share: requiredPairs > 0 ? supportedPairs / requiredPairs : 0,
        defined: requiredPairs > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    toothIds: ["t1", "t1", "t2"],
    landmarkIds: ["a", "b", "a"],
    observed: [true, false, true],
    requiredLandmarks: ["a", "b"],
  },
  output: { requiredPairs: 4, supportedPairs: 2, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const toothLandmarkSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthodontics/tooth-landmark-support-share",
    title: "Tooth Landmark Support Share Tool",
    description:
      "Calculate tooth landmark support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        toothIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        landmarkIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        requiredLandmarks: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["toothIds", "landmarkIds", "observed", "requiredLandmarks"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredPairs: { type: "integer" },
        supportedPairs: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["requiredPairs", "supportedPairs", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "toothIds",
          label: "Tooth Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "landmarkIds",
          label: "Landmark Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "requiredLandmarks",
          label: "Required Landmarks",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "requiredPairs",
          label: "Required Pairs",
          valueType: { type: "integer" },
        },
        {
          id: "supportedPairs",
          label: "Supported Pairs",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = toothLandmarkSupportShareTool.execute;
export default toothLandmarkSupportShareTool;

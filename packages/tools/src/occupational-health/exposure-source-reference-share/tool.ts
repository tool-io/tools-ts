import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exposures: readonly number[];
  readonly sourceMatched: readonly boolean[];
  readonly referenceMatched: readonly boolean[];
};
export type Output = {
  readonly totalExposure: number;
  readonly supportedExposure: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposures: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    sourceMatched: { type: "array", maxItems: 256, items: { type: "boolean" } },
    referenceMatched: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["exposures", "sourceMatched", "referenceMatched"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalExposure: { type: "number" },
    supportedExposure: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["totalExposure", "supportedExposure", "share", "defined"],
} as const;
/** Calculate exposure source reference share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exposures, sourceMatched, referenceMatched } = request;
  const compute = (): Output => {
    H.sameLength(exposures, sourceMatched);
    H.sameLength(exposures, referenceMatched);
    H.domain(exposures.every((x) => x >= 0));
    return (() => {
      const totalExposure = exposures.reduce((a, b) => a + b, 0),
        supportedExposure = exposures.reduce(
          (s, x, i) => s + (sourceMatched[i] && referenceMatched[i] ? x : 0),
          0,
        );
      return {
        totalExposure,
        supportedExposure,
        share: totalExposure > 0 ? supportedExposure / totalExposure : 0,
        defined: totalExposure > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    exposures: [2, 3, 5],
    sourceMatched: [true, true, false],
    referenceMatched: [true, false, true],
  },
  output: {
    totalExposure: 10,
    supportedExposure: 2,
    share: 0.2,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const exposureSourceReferenceShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-health/exposure-source-reference-share",
    title: "Exposure Source Reference Share Tool",
    description:
      "Calculate exposure source reference share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposures: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        sourceMatched: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        referenceMatched: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["exposures", "sourceMatched", "referenceMatched"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalExposure: { type: "number" },
        supportedExposure: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["totalExposure", "supportedExposure", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "exposures",
          label: "Exposures",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sourceMatched",
          label: "Source Matched",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "referenceMatched",
          label: "Reference Matched",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "totalExposure",
          label: "Total Exposure",
          valueType: { type: "number" },
        },
        {
          id: "supportedExposure",
          label: "Supported Exposure",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = exposureSourceReferenceShareTool.execute;
export default exposureSourceReferenceShareTool;

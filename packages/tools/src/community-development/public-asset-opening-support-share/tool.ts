import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingDurations: readonly number[];
  readonly staffed: readonly boolean[];
  readonly accessible: readonly boolean[];
};
export type Output = {
  readonly openingDuration: number;
  readonly supportedDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    staffed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    accessible: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["openingDurations", "staffed", "accessible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingDuration: { type: "number" },
    supportedDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["openingDuration", "supportedDuration", "share", "defined"],
} as const;
/** Calculate public asset opening support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingDurations, staffed, accessible } = request;
  const compute = (): Output => {
    H.sameLength(openingDurations, staffed);
    H.sameLength(openingDurations, accessible);
    H.domain(openingDurations.every((x) => x >= 0));
    return (() => {
      const openingDuration = openingDurations.reduce((a, b) => a + b, 0),
        supportedDuration = openingDurations.reduce(
          (s, x, i) => s + (staffed[i] && accessible[i] ? x : 0),
          0,
        );
      return {
        openingDuration,
        supportedDuration,
        share: openingDuration > 0 ? supportedDuration / openingDuration : 0,
        defined: openingDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingDurations: [2, 3, 5],
    staffed: [true, true, false],
    accessible: [true, false, true],
  },
  output: {
    openingDuration: 10,
    supportedDuration: 2,
    share: 0.2,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const publicAssetOpeningSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-development/public-asset-opening-support-share",
    title: "Public Asset Opening Support Share Tool",
    description:
      "Calculate public asset opening support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        staffed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        accessible: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["openingDurations", "staffed", "accessible"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingDuration: { type: "number" },
        supportedDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["openingDuration", "supportedDuration", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "openingDurations",
          label: "Opening Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "staffed",
          label: "Staffed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "accessible",
          label: "Accessible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "openingDuration",
          label: "Opening Duration",
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
export const run = publicAssetOpeningSupportShareTool.execute;
export default publicAssetOpeningSupportShareTool;

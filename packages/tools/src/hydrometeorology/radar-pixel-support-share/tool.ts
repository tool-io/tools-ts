import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly supported: readonly boolean[];
  readonly included: readonly boolean[];
};
export type Output = {
  readonly supportedIncluded: number;
  readonly includedCount: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supported: { type: "array", maxItems: 256, items: { type: "boolean" } },
    included: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["supported", "included"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supportedIncluded: { type: "integer" },
    includedCount: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["supportedIncluded", "includedCount", "share", "defined"],
} as const;
/** Calculate radar pixel support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { supported, included } = request;
  const compute = (): Output => {
    H.sameLength(supported, included);
    return {
      supportedIncluded: supported.filter((x, i) => x && included[i]).length,
      includedCount: included.filter(Boolean).length,
      share: included.some(Boolean)
        ? supported.filter((x, i) => x && included[i]).length /
          included.filter(Boolean).length
        : 0,
      defined: included.some(Boolean),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { supported: [true, false, true], included: [true, true, false] },
  output: { supportedIncluded: 1, includedCount: 2, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const radarPixelSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/radar-pixel-support-share",
    title: "Radar Pixel Support Share Tool",
    description:
      "Calculate radar pixel support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supported: { type: "array", maxItems: 256, items: { type: "boolean" } },
        included: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["supported", "included"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supportedIncluded: { type: "integer" },
        includedCount: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["supportedIncluded", "includedCount", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "supported",
          label: "Supported",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "included",
          label: "Included",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "supportedIncluded",
          label: "Supported Included",
          valueType: { type: "integer" },
        },
        {
          id: "includedCount",
          label: "Included Count",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = radarPixelSupportShareTool.execute;
export default radarPixelSupportShareTool;

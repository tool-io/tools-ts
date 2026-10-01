import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly maskPixels: readonly number[];
  readonly sampledPixels: readonly number[];
};
export type Output = {
  readonly maskTotalDecimal: string;
  readonly sampledTotalDecimal: string;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maskPixels: { type: "array", maxItems: 256, items: { type: "integer" } },
    sampledPixels: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["maskPixels", "sampledPixels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maskTotalDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    sampledTotalDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["maskTotalDecimal", "sampledTotalDecimal", "share", "defined"],
} as const;
/** Account for sampled pixels in supplied disjoint research masks; no lesion detection, staging or prognosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { maskPixels, sampledPixels } = request;
  const compute = (): Output => {
    H.sameLength(maskPixels, sampledPixels);
    H.domain(
      maskPixels.every(
        (x, i) => x >= 0 && sampledPixels[i] >= 0 && sampledPixels[i] <= x,
      ),
    );
    return (() => {
      const a = maskPixels.reduce((s, x) => s + BigInt(x), 0n),
        b = sampledPixels.reduce((s, x) => s + BigInt(x), 0n);
      return {
        maskTotalDecimal: a.toString(),
        sampledTotalDecimal: b.toString(),
        share: a > 0n ? Number(b) / Number(a) : 0,
        defined: a > 0n,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { maskPixels: [10, 20], sampledPixels: [5, 10] },
  output: {
    maskTotalDecimal: "30",
    sampledTotalDecimal: "15",
    share: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const lesionMaskSamplingShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/lesion-mask-sampling-share",
    title: "Lesion Mask Sampling Share Tool",
    description:
      "Account for sampled pixels in supplied disjoint research masks; no lesion detection, staging or prognosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        maskPixels: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        sampledPixels: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["maskPixels", "sampledPixels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        maskTotalDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        sampledTotalDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["maskTotalDecimal", "sampledTotalDecimal", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "maskPixels",
          label: "Mask Pixels",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "sampledPixels",
          label: "Sampled Pixels",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "maskTotalDecimal",
          label: "Mask Total Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "sampledTotalDecimal",
          label: "Sampled Total Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = lesionMaskSamplingShareTool.execute;
export default lesionMaskSamplingShareTool;

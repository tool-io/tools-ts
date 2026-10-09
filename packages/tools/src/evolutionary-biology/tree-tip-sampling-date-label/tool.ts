import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tipId: string;
  readonly samplingDate: string;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tipId: { type: "string", maxLength: 8192, minLength: 1 },
    samplingDate: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["tipId", "samplingDate", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach an explicit date-only sampling date and source to a phylogenetic tip without dating a tree. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tipId, samplingDate, source } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    H.domain(tipId.length > 0 && source.length > 0, "tipId");
    namedDate(samplingDate, "samplingDate");
    return { label: tipId + "; sampled=" + samplingDate + " [" + source + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tipId: "TIP17", samplingDate: "2026-03-15", source: "Specimen log" },
  output: { label: "TIP17; sampled=2026-03-15 [Specimen log]" },
} satisfies ToolExample<Input, Output>;
export const treeTipSamplingDateLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["evolutionary-biology", "evolutionary biology", "biology"],
      keywords: ["evolutionary biology", "biology"],
    },
    id: "evolutionary-biology/tree-tip-sampling-date-label",
    title: "Tree Tip Sampling Date Label",
    description:
      "Attach an explicit date-only sampling date and source to a phylogenetic tip without dating a tree.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tipId: { type: "string", maxLength: 8192, minLength: 1 },
        samplingDate: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["tipId", "samplingDate", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "tipId",
          label: "Tip Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "samplingDate",
          label: "Sampling Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = treeTipSamplingDateLabelTool.execute;
export default treeTipSamplingDateLabelTool;

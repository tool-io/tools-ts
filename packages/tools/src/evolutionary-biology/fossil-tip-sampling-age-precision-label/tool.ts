import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tipId: string;
  readonly suppliedAge: number;
  readonly ageUnit: string;
  readonly precisionTag: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tipId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAge: { type: "number", minimum: 0 },
    ageUnit: { type: "string", maxLength: 8192, minLength: 1 },
    precisionTag: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["tipId", "suppliedAge", "ageUnit", "precisionTag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach a supplied age and precision tag to a fossil tip without estimating age uncertainty or fitting a clock. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tipId, suppliedAge, ageUnit, precisionTag } = request;
  const compute = (): Output => {
    H.domain(
      tipId.length > 0 && ageUnit.length > 0 && precisionTag.length > 0,
      "tipId",
    );
    H.domain(suppliedAge >= 0, "suppliedAge");
    return {
      label:
        tipId +
        "; age=" +
        suppliedAge +
        " " +
        ageUnit +
        " [" +
        precisionTag +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    tipId: "F17",
    suppliedAge: 12.5,
    ageUnit: "Ma",
    precisionTag: "interval estimate",
  },
  output: { label: "F17; age=12.5 Ma [interval estimate]" },
} satisfies ToolExample<Input, Output>;
export const fossilTipSamplingAgePrecisionLabelTool = H.defineSchemaCalculation<
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
    id: "evolutionary-biology/fossil-tip-sampling-age-precision-label",
    title: "Fossil Tip Sampling Age Precision Label",
    description:
      "Attach a supplied age and precision tag to a fossil tip without estimating age uncertainty or fitting a clock.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tipId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedAge: { type: "number", minimum: 0 },
        ageUnit: { type: "string", maxLength: 8192, minLength: 1 },
        precisionTag: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["tipId", "suppliedAge", "ageUnit", "precisionTag"],
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
          id: "suppliedAge",
          label: "Supplied Age",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ageUnit",
          label: "Age Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "precisionTag",
          label: "Precision Tag",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fossilTipSamplingAgePrecisionLabelTool.execute;
export default fossilTipSamplingAgePrecisionLabelTool;

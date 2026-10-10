import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly suppliedLimit: number;
  readonly unitText: string;
  readonly lessThanOrEqual: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedLimit: { type: "number", minimum: 0 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
    lessThanOrEqual: { type: "boolean" },
  },
  required: ["sampleId", "suppliedLimit", "unitText", "lessThanOrEqual"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format an explicit microbial censoring bound without imputing a count or establishing a laboratory detection limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, suppliedLimit, unitText, lessThanOrEqual } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0 && unitText.length > 0, "sampleId");
    H.domain(suppliedLimit >= 0, "suppliedLimit");
    return {
      label:
        sampleId +
        ": " +
        (lessThanOrEqual ? "<=" : "<") +
        suppliedLimit +
        " " +
        unitText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleId: "S17",
    suppliedLimit: 10,
    unitText: "CFU/mL",
    lessThanOrEqual: false,
  },
  output: { label: "S17: <10 CFU/mL" },
} satisfies ToolExample<Input, Output>;
export const microbialBelowLimitMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["microbiology", "biology"],
      keywords: ["microbiology", "biology"],
    },
    id: "microbiology/microbial-below-limit-marker",
    title: "Microbial Below Limit Marker",
    description:
      "Format an explicit microbial censoring bound without imputing a count or establishing a laboratory detection limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedLimit: { type: "number", minimum: 0 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
        lessThanOrEqual: { type: "boolean" },
      },
      required: ["sampleId", "suppliedLimit", "unitText", "lessThanOrEqual"],
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
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedLimit",
          label: "Supplied Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lessThanOrEqual",
          label: "Less Than Or Equal",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = microbialBelowLimitMarkerTool.execute;
export default microbialBelowLimitMarkerTool;

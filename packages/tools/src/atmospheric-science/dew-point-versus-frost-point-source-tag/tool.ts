import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly reportedReference: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    reportedReference: {
      type: "string",
      maxLength: 8192,
      enum: ["dewpoint", "frostpoint", "unspecified"],
    },
  },
  required: ["recordId", "reportedReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly reported liquid-water or ice saturation reference without converting temperatures. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, reportedReference } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      ["dewpoint", "frostpoint", "unspecified"].includes(reportedReference),
      "reportedReference",
    );
    return { label: recordId + " [" + reportedReference + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", reportedReference: "frostpoint" },
  output: { label: "R17 [frostpoint]" },
} satisfies ToolExample<Input, Output>;
export const dewpointVersusFrostpointSourceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "atmospheric-science",
        "atmospheric science",
        "earth and environmental sciences",
      ],
      keywords: ["atmospheric science", "earth and environmental sciences"],
    },
    id: "atmospheric-science/dew-point-versus-frost-point-source-tag",
    title: "Dew Point Versus Frost Point Source Tag",
    description:
      "Label an explicitly reported liquid-water or ice saturation reference without converting temperatures.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        reportedReference: {
          type: "string",
          maxLength: 8192,
          enum: ["dewpoint", "frostpoint", "unspecified"],
        },
      },
      required: ["recordId", "reportedReference"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportedReference",
          label: "Reported Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = dewpointVersusFrostpointSourceTagTool.execute;
export default dewpointVersusFrostpointSourceTagTool;

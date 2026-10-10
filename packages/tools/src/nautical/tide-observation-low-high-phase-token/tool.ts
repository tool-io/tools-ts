import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly reportedPhase: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    reportedPhase: {
      type: "string",
      maxLength: 8192,
      enum: ["low", "rising", "high", "falling", "unspecified"],
    },
  },
  required: ["recordId", "reportedPhase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly reported tide phase without predicting tides or deriving phase from a height. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, reportedPhase } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      ["low", "rising", "high", "falling", "unspecified"].includes(
        reportedPhase,
      ),
      "reportedPhase",
    );
    return { label: recordId + " [" + reportedPhase + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "T17", reportedPhase: "rising" },
  output: { label: "T17 [rising]" },
} satisfies ToolExample<Input, Output>;
export const tideObservationLowHighPhaseTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["nautical", "engineering"],
      keywords: ["nautical", "engineering"],
    },
    id: "nautical/tide-observation-low-high-phase-token",
    title: "Tide Observation Low High Phase Token",
    description:
      "Label an explicitly reported tide phase without predicting tides or deriving phase from a height.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        reportedPhase: {
          type: "string",
          maxLength: 8192,
          enum: ["low", "rising", "high", "falling", "unspecified"],
        },
      },
      required: ["recordId", "reportedPhase"],
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
          id: "reportedPhase",
          label: "Reported Phase",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = tideObservationLowHighPhaseTokenTool.execute;
export default tideObservationLowHighPhaseTokenTool;

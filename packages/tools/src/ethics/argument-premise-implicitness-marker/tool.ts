import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly premiseId: string;
  readonly recordedStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    premiseId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["explicit", "implicit", "uncertain"],
    },
  },
  required: ["premiseId", "recordedStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly annotated premise implicitness status without reconstructing an argument. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { premiseId, recordedStatus } = request;
  const compute = (): Output => {
    H.domain(premiseId.length > 0, "premiseId");
    H.domain(
      ["explicit", "implicit", "uncertain"].includes(recordedStatus),
      "recordedStatus",
    );
    return { label: premiseId + " [" + recordedStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { premiseId: "P17", recordedStatus: "implicit" },
  output: { label: "P17 [implicit]" },
} satisfies ToolExample<Input, Output>;
export const argumentPremiseImplicitnessMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["ethics", "philosophy"],
      keywords: ["ethics", "philosophy"],
    },
    id: "ethics/argument-premise-implicitness-marker",
    title: "Argument Premise Implicitness Marker",
    description:
      "Label an explicitly annotated premise implicitness status without reconstructing an argument.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        premiseId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["explicit", "implicit", "uncertain"],
        },
      },
      required: ["premiseId", "recordedStatus"],
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
          id: "premiseId",
          label: "Premise Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedStatus",
          label: "Recorded Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = argumentPremiseImplicitnessMarkerTool.execute;
export default argumentPremiseImplicitnessMarkerTool;

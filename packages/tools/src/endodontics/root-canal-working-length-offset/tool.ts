import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedReferenceLength: number;
  readonly suppliedOffset: number;
};
export type Output = { readonly offsetLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedReferenceLength: { type: "number", minimum: 0 },
    suppliedOffset: { type: "number" },
  },
  required: ["recordedReferenceLength", "suppliedOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offsetLength: { type: "number" } },
  required: ["offsetLength"],
} as const;
/** Apply an explicit signed length offset to a supplied canal reference measurement without recommending a working length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedReferenceLength, suppliedOffset } = request;
  const compute = (): Output => {
    H.domain(
      recordedReferenceLength >= 0 &&
        recordedReferenceLength + suppliedOffset >= 0,
      "recordedReferenceLength",
    );
    return { offsetLength: recordedReferenceLength + suppliedOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedReferenceLength: 20, suppliedOffset: -0.5 },
  output: { offsetLength: 19.5 },
} satisfies ToolExample<Input, Output>;
export const rootCanalWorkingLengthOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["endodontics", "health and medicine"],
      keywords: ["endodontics", "health and medicine"],
    },
    id: "endodontics/root-canal-working-length-offset",
    title: "Root Canal Working Length Offset",
    description:
      "Apply an explicit signed length offset to a supplied canal reference measurement without recommending a working length.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedReferenceLength: { type: "number", minimum: 0 },
        suppliedOffset: { type: "number" },
      },
      required: ["recordedReferenceLength", "suppliedOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offsetLength: { type: "number" } },
      required: ["offsetLength"],
    },
    ports: {
      inputs: [
        {
          id: "recordedReferenceLength",
          label: "Recorded Reference Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOffset",
          label: "Supplied Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "offsetLength",
          label: "Offset Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rootCanalWorkingLengthOffsetTool.execute;
export default rootCanalWorkingLengthOffsetTool;

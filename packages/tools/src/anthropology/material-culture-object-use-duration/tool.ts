import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedUseStart: number;
  readonly recordedUseEnd: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedUseStart: { type: "number" },
    recordedUseEnd: { type: "number" },
  },
  required: ["recordedUseStart", "recordedUseEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit object-use start from end markers on the same caller-supplied time basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedUseStart, recordedUseEnd } = request;
  const compute = (): Output => {
    return { signedGap: recordedUseEnd - recordedUseStart };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedUseStart: 12, recordedUseEnd: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const materialCultureObjectUseDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["anthropology", "social sciences"],
      keywords: ["anthropology", "social sciences"],
    },
    id: "anthropology/material-culture-object-use-duration",
    title: "Material Culture Object Use Duration",
    description:
      "Subtract explicit object-use start from end markers on the same caller-supplied time basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedUseStart: { type: "number" },
        recordedUseEnd: { type: "number" },
      },
      required: ["recordedUseStart", "recordedUseEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "recordedUseStart",
          label: "Recorded Use Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedUseEnd",
          label: "Recorded Use End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = materialCultureObjectUseDurationTool.execute;
export default materialCultureObjectUseDurationTool;

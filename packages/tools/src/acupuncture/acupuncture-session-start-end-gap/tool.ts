import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startMinutes: number;
  readonly endMinutes: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startMinutes: { type: "number" },
    endMinutes: { type: "number" },
  },
  required: ["startMinutes", "endMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit session start from end markers in minutes without recommending session duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startMinutes, endMinutes } = request;
  const compute = (): Output => {
    return { signedGap: endMinutes - startMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startMinutes: 12, endMinutes: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const acupunctureSessionStartEndGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["acupuncture", "health and medicine"],
      keywords: ["acupuncture", "health and medicine"],
    },
    id: "acupuncture/acupuncture-session-start-end-gap",
    title: "Acupuncture Session Start End Gap",
    description:
      "Subtract explicit session start from end markers in minutes without recommending session duration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startMinutes: { type: "number" },
        endMinutes: { type: "number" },
      },
      required: ["startMinutes", "endMinutes"],
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
          id: "startMinutes",
          label: "Start Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endMinutes",
          label: "End Minutes",
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
export const run = acupunctureSessionStartEndGapTool.execute;
export default acupunctureSessionStartEndGapTool;

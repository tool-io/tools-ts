import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly ear: string };
export type Output = { readonly code: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ear: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "both", "unspecified"],
    },
  },
  required: ["ear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { code: { type: "string", maxLength: 8192 } },
  required: ["code"],
} as const;
/** Encode explicitly supplied ear laterality using the local L/R/B/U convention, without claiming a clinical terminology-system code. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ear } = request;
  const compute = (): Output => {
    H.domain(["left", "right", "both", "unspecified"].includes(ear), "ear");
    return {
      code:
        ear === "left"
          ? "L"
          : ear === "right"
            ? "R"
            : ear === "both"
              ? "B"
              : "U",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ear: "left" },
  output: { code: "L" },
} satisfies ToolExample<Input, Output>;
export const audiologyEarLateralityCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["audiology", "health and medicine"],
      keywords: ["audiology", "health and medicine"],
    },
    id: "audiology/audiology-ear-laterality-code",
    title: "Audiology Ear Laterality Code",
    description:
      "Encode explicitly supplied ear laterality using the local L/R/B/U convention, without claiming a clinical terminology-system code.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ear: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "both", "unspecified"],
        },
      },
      required: ["ear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { code: { type: "string", maxLength: 8192 } },
      required: ["code"],
    },
    ports: {
      inputs: [
        {
          id: "ear",
          label: "Ear",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "code", label: "Code", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = audiologyEarLateralityCodeTool.execute;
export default audiologyEarLateralityCodeTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly runId: string;
  readonly fillTimeText: string;
  readonly clockReference: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    runId: { type: "string", maxLength: 8192, minLength: 1 },
    fillTimeText: { type: "string", maxLength: 8192, minLength: 1 },
    clockReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["runId", "fillTimeText", "clockReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit cryogenic run fill-time transcription and clock reference without controlling equipment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { runId, fillTimeText, clockReference } = request;
  const compute = (): Output => {
    H.domain(runId.length > 0, "runId");
    H.domain(fillTimeText.length > 0, "fillTimeText");
    H.domain(clockReference.length > 0, "clockReference");
    return { token: JSON.stringify([runId, fillTimeText, clockReference]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    runId: "R17",
    fillTimeText: "2026-11-01 09:00",
    clockReference: "UTC",
  },
  output: { token: '["R17","2026-11-01 09:00","UTC"]' },
} satisfies ToolExample<Input, Output>;
export const cryogenicRunFillTimeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cryogenics", "physics"],
      keywords: ["cryogenics", "physics"],
    },
    id: "cryogenics/cryogenic-run-fill-time-label",
    title: "Cryogenic Run Fill Time Label",
    description:
      "Record an explicit cryogenic run fill-time transcription and clock reference without controlling equipment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        runId: { type: "string", maxLength: 8192, minLength: 1 },
        fillTimeText: { type: "string", maxLength: 8192, minLength: 1 },
        clockReference: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["runId", "fillTimeText", "clockReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "runId",
          label: "Run Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fillTimeText",
          label: "Fill Time Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "clockReference",
          label: "Clock Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = cryogenicRunFillTimeLabelTool.execute;
export default cryogenicRunFillTimeLabelTool;

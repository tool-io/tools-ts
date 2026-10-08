import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly marker: string; readonly repetitions: number };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marker: { type: "string", maxLength: 8192, minLength: 1 },
    repetitions: { type: "integer", minimum: 1, maximum: 32 },
  },
  required: ["marker", "repetitions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an explicit manuscript scene-break line from a repeated marker separated by single spaces. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { marker, repetitions } = request;
  const compute = (): Output => {
    H.domain(marker.length > 0 && marker.length <= 32, "marker");
    (H.domain(
      Number.isSafeInteger(repetitions) &&
        repetitions >= 1 &&
        repetitions <= 32,
      "repetitions",
    ),
      repetitions);
    return { token: Array<string>(repetitions).fill(marker).join(" ") };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { marker: "*", repetitions: 3 },
  output: { token: "* * *" },
} satisfies ToolExample<Input, Output>;
export const manuscriptSceneBreakTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["creative-writing", "creative writing", "humanities"],
      keywords: ["creative writing", "humanities"],
    },
    id: "creative-writing/manuscript-scene-break-token",
    title: "Manuscript Scene Break Token",
    description:
      "Build an explicit manuscript scene-break line from a repeated marker separated by single spaces.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marker: { type: "string", maxLength: 8192, minLength: 1 },
        repetitions: { type: "integer", minimum: 1, maximum: 32 },
      },
      required: ["marker", "repetitions"],
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
          id: "marker",
          label: "Marker",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "repetitions",
          label: "Repetitions",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = manuscriptSceneBreakTokenTool.execute;
export default manuscriptSceneBreakTokenTool;

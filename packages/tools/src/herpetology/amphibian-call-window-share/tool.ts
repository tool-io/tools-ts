import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly callDuration: number;
  readonly windowDuration: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    callDuration: { type: "number", minimum: 0 },
    windowDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["callDuration", "windowDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate amphibian call window share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { callDuration, windowDuration } = request;
  const compute = (): Output => {
    H.positive(windowDuration);
    H.domain(callDuration >= 0 && callDuration <= windowDuration);
    return { share: callDuration / windowDuration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { callDuration: 3, windowDuration: 12 },
  output: { share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const amphibianCallWindowShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/amphibian-call-window-share",
    title: "Amphibian Call Window Share Tool",
    description:
      "Calculate amphibian call window share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        callDuration: { type: "number", minimum: 0 },
        windowDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["callDuration", "windowDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "callDuration",
          label: "Call Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowDuration",
          label: "Window Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = amphibianCallWindowShareTool.execute;
export default amphibianCallWindowShareTool;

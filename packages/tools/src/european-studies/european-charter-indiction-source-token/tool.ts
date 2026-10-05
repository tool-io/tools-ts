import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly indiction: number; readonly sourceId: string };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indiction: { type: "integer", minimum: 1, maximum: 15 },
    sourceId: { type: "string", maxLength: 8192 },
  },
  required: ["indiction", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied indiction number from one to fifteen with its source without converting it to a unique calendar year. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { indiction, sourceId } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(indiction) && indiction >= 1 && indiction <= 15,
      "indiction",
    ),
      indiction);
    H.domain(sourceId.length > 0, "sourceId");
    return { token: "indiction " + indiction + " [" + sourceId + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { indiction: 7, sourceId: "Charter A" },
  output: { token: "indiction 7 [Charter A]" },
} satisfies ToolExample<Input, Output>;
export const europeanCharterIndictionSourceTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "european-studies/european-charter-indiction-source-token",
      title: "European Charter Indiction Source Token Tool",
      description:
        "Record a supplied indiction number from one to fifteen with its source without converting it to a unique calendar year.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          indiction: { type: "integer", minimum: 1, maximum: 15 },
          sourceId: { type: "string", maxLength: 8192 },
        },
        required: ["indiction", "sourceId"],
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
            id: "indiction",
            label: "Indiction",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "sourceId",
            label: "Source Id",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = europeanCharterIndictionSourceTokenTool.execute;
export default europeanCharterIndictionSourceTokenTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly unbounded: boolean; readonly seconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unbounded: { type: "boolean" }, seconds: { type: "integer" } },
  required: ["unbounded", "seconds"],
} as const;
/** Calculate http cache control maxstale unbounded token from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const r = /^max-stale(?:=(\d+))?(?![\s\S])/i.exec(token);
    H.domain(r !== null);
    const seconds = Number(r[1] ?? 0);
    H.integer(seconds, 0);
    return { unbounded: r[1] === undefined, seconds };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "max-stale" },
  output: { unbounded: true, seconds: 0 },
} satisfies ToolExample<Input, Output>;
export const httpCacheControlMaxstaleUnboundedTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "web/http-cache-control-maxstale-unbounded-token",
      title: "HTTP Cache Control Maxstale Unbounded Token Tool",
      description:
        "Calculate http cache control maxstale unbounded token from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unbounded: { type: "boolean" },
          seconds: { type: "integer" },
        },
        required: ["unbounded", "seconds"],
      },
      ports: {
        inputs: [
          {
            id: "token",
            label: "Token",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "unbounded",
            label: "Unbounded",
            valueType: { type: "boolean" },
          },
          { id: "seconds", label: "Seconds", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = httpCacheControlMaxstaleUnboundedTokenTool.execute;
export default httpCacheControlMaxstaleUnboundedTokenTool;

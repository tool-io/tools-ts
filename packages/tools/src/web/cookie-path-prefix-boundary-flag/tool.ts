import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cookiePath: string;
  readonly requestPath: string;
};
export type Output = { readonly matches: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cookiePath: { type: "string", maxLength: 8192 },
    requestPath: { type: "string", maxLength: 8192 },
  },
  required: ["cookiePath", "requestPath"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matches: { type: "boolean" } },
  required: ["matches"],
} as const;
/** Calculate cookie path prefix boundary flag from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { cookiePath, requestPath } = input;
  const compute = (): Output => {
    H.domain(cookiePath.startsWith("/") && requestPath.startsWith("/"));
    return {
      matches:
        requestPath === cookiePath ||
        (requestPath.startsWith(cookiePath) &&
          (cookiePath.endsWith("/") || requestPath[cookiePath.length] === "/")),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { cookiePath: "/foo", requestPath: "/foobar" },
  output: { matches: false },
} satisfies ToolExample<Input, Output>;
export const cookiePathPrefixBoundaryFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/cookie-path-prefix-boundary-flag",
    title: "Cookie Path Prefix Boundary Flag Tool",
    description:
      "Calculate cookie path prefix boundary flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cookiePath: { type: "string", maxLength: 8192 },
        requestPath: { type: "string", maxLength: 8192 },
      },
      required: ["cookiePath", "requestPath"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { matches: { type: "boolean" } },
      required: ["matches"],
    },
    ports: {
      inputs: [
        {
          id: "cookiePath",
          label: "Cookie Path",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requestPath",
          label: "Request Path",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = cookiePathPrefixBoundaryFlagTool.execute;
export default cookiePathPrefixBoundaryFlagTool;

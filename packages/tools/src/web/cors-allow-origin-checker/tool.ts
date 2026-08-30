import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CorsAllowOriginCheckerInput = Readonly<{
  readonly requestOrigin: string;
  readonly allowOrigin: string;
  readonly credentialsIncluded: boolean;
}>;
export type CorsAllowOriginCheckerOutput = Readonly<{
  readonly allowed: boolean;
}>;

export const calculateCorsAllowOriginChecker = (
  x: CorsAllowOriginCheckerInput,
): CorsAllowOriginCheckerOutput => {
  if (typeof x.requestOrigin !== "string")
    simpleError("requestOrigin", "Provide a string.");
  if (typeof x.allowOrigin !== "string")
    simpleError("allowOrigin", "Provide a string.");
  if (typeof x.credentialsIncluded !== "boolean")
    simpleError("credentialsIncluded", "Provide a boolean.");
  const allowed =
    x.allowOrigin === "*"
      ? !x.credentialsIncluded
      : x.allowOrigin === x.requestOrigin;
  return { allowed };
};

export const example = {
  input: {
    requestOrigin: "https://example.com",
    allowOrigin: "https://example.com",
    credentialsIncluded: true,
  },
  output: { allowed: true },
} satisfies ToolExample<
  CorsAllowOriginCheckerInput,
  CorsAllowOriginCheckerOutput
>;

export const tool = createSimpleTool({
  id: "web/cors-allow-origin-checker",
  title: "CORS Allow-Origin Checker",
  description:
    "Check only whether Access-Control-Allow-Origin matches a supplied request Origin, including the wildcard restriction for credentialed requests.",
  inputs: [
    { id: "requestOrigin", kind: "string", label: "Request Origin" },
    { id: "allowOrigin", kind: "string", label: "Access-Control-Allow-Origin" },
    {
      id: "credentialsIncluded",
      kind: "boolean",
      label: "Credentials included",
    },
  ],
  outputs: [{ id: "allowed", kind: "boolean", label: "Origin allowed" }],
  calculate: (input) =>
    calculateCorsAllowOriginChecker({
      requestOrigin: input.requestOrigin as string,
      allowOrigin: input.allowOrigin as string,
      credentialsIncluded: input.credentialsIncluded as boolean,
    }),
});
export const corsAllowOriginCheckerTool = tool;
export const runCorsAllowOriginChecker = tool.execute;
export default tool;

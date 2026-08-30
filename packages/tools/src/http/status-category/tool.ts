import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StatusCategoryInput = Readonly<{
  readonly statusCode: number;
}>;
export type StatusCategoryOutput = Readonly<{
  readonly category: string;
}>;

export const calculateStatusCategory = (
  x: StatusCategoryInput,
): StatusCategoryOutput => {
  if (!Number.isSafeInteger(x.statusCode))
    simpleError("statusCode", "Provide a safe integer.");
  if (
    !Number.isSafeInteger(x.statusCode) ||
    x.statusCode < 100 ||
    x.statusCode > 599
  )
    simpleError("statusCode", "HTTP status codes range from 100 to 599.");
  const category = [
    "",
    "Informational",
    "Successful",
    "Redirection",
    "Client Error",
    "Server Error",
  ][Math.floor(x.statusCode / 100)];
  return { category };
};

export const example = {
  input: { statusCode: 404 },
  output: { category: "Client Error" },
} satisfies ToolExample<StatusCategoryInput, StatusCategoryOutput>;

export const tool = createSimpleTool({
  id: "http/status-category",
  title: "HTTP Status Category",
  description:
    "Classify an HTTP response status code into its RFC 9110 1xx–5xx response class.",
  inputs: [{ id: "statusCode", kind: "integer", label: "HTTP status code" }],
  outputs: [{ id: "category", kind: "string", label: "Response class" }],
  calculate: (input) =>
    calculateStatusCategory({
      statusCode: input.statusCode as number,
    }),
});
export const statusCategoryTool = tool;
export const runStatusCategory = tool.execute;
export default tool;

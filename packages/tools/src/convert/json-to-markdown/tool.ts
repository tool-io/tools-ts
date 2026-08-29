import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const escapeCell = (value: unknown): string =>
  String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, "<br>");
const render = (value: unknown, depth = 0): string => {
  if (depth > 20)
    simpleError("json", "JSON nesting exceeds 20 levels.", "resource_limit");
  if (Array.isArray(value)) {
    if (value.length === 0) return "_(empty list)_";
    if (
      value.every(
        (row) => row && typeof row === "object" && !Array.isArray(row),
      )
    ) {
      const keys = [
        ...new Set(
          value.flatMap((row) => Object.keys(row as Record<string, unknown>)),
        ),
      ];
      if (
        keys.length &&
        value.every((row) =>
          Object.values(row as Record<string, unknown>).every(
            (cell) => cell === null || typeof cell !== "object",
          ),
        )
      )
        return `| ${keys.map(escapeCell).join(" | ")} |\n| ${keys.map(() => "---").join(" | ")} |\n${value.map((row) => `| ${keys.map((key) => escapeCell((row as Record<string, unknown>)[key])).join(" | ")} |`).join("\n")}`;
    }
    return value
      .map((item) => `- ${render(item, depth + 1).replace(/\n/g, "\n  ")}`)
      .join("\n");
  }
  if (value && typeof value === "object")
    return Object.entries(value)
      .map(([key, item]) => {
        if (item && typeof item === "object")
          return `${"#".repeat(Math.min(depth + 2, 6))} ${key}\n\n${render(item, depth + 1)}`;
        return `- **${key.replace(/\*/g, "\\*")}**: ${String(item ?? "null")}`;
      })
      .join("\n\n");
  return String(value);
};

export const example = {
  input: { json: '[{"a":1,"b":"x"},{"a":2,"b":"y"}]' },
  output: { markdown: "| a | b |\n| --- | --- |\n| 1 | x |\n| 2 | y |" },
} satisfies ToolExample<
  { readonly json: string },
  { readonly markdown: string }
>;

export const tool = createSimpleTool({
  id: "convert/json-to-markdown",
  title: "JSON to Markdown Converter",
  description:
    "Render JSON arrays of flat objects as GitHub-flavored Markdown tables, with nested objects as sections and other arrays as lists. This formats data; it does not execute or trust embedded markup.",
  inputs: [{ id: "json", kind: "string", label: "JSON" }],
  outputs: [{ id: "markdown", kind: "string", label: "Markdown" }],
  calculate: (input) => {
    let value: unknown;
    try {
      value = JSON.parse(input.json as string);
    } catch {
      simpleError("json", "Enter valid JSON.", "invalid_json");
    }
    return { markdown: render(value) };
  },
});
export type JsonToMarkdownInput = Readonly<typeof example.input>;
export type JsonToMarkdownOutput = Readonly<typeof example.output>;
export const jsonToMarkdownTool = tool;
export const runJsonToMarkdown = tool.execute;
export default tool;

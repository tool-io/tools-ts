import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly headerValue: string };
export type Output = { readonly includeSubDomains: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { headerValue: { type: "string", maxLength: 8192 } },
  required: ["headerValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { includeSubDomains: { type: "boolean" } },
  required: ["includeSubDomains"],
} as const;
/** Detect a standalone case-insensitive includeSubDomains directive in an HSTS field value; this is not a complete HSTS policy validator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { headerValue } = request;
  const compute = (): Output => {
    H.domain(!/[\r\n]/.test(headerValue), "headerValue");
    const directives: string[] = [];
    let current = "";
    let quoted = false;
    let escaped = false;
    const append = () => {
      directives.push(current.replace(/^[ \t]+|[ \t]+$/g, ""));
      current = "";
    };
    for (const character of headerValue) {
      if (escaped) {
        current += character;
        escaped = false;
      } else if (quoted && character === "\\") {
        current += character;
        escaped = true;
      } else if (character === '"') {
        current += character;
        quoted = !quoted;
      } else if (character === ";" && !quoted) {
        append();
      } else {
        current += character;
      }
    }
    H.domain(
      !quoted && !escaped,
      "headerValue",
      "Close the quoted directive value.",
    );
    append();
    return {
      includeSubDomains: directives.some((v) =>
        /^includeSubDomains(?![\s\S])/i.test(v),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { headerValue: "max-age=31536000; includeSubDomains" },
  output: { includeSubDomains: true },
} satisfies ToolExample<Input, Output>;
export const hstsIncludeSubDomainsFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/hsts-include-sub-domains-flag",
    title: "HSTS Include Sub Domains Flag Tool",
    description:
      "Detect a standalone case-insensitive includeSubDomains directive in an HSTS field value; this is not a complete HSTS policy validator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { headerValue: { type: "string", maxLength: 8192 } },
      required: ["headerValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { includeSubDomains: { type: "boolean" } },
      required: ["includeSubDomains"],
    },
    ports: {
      inputs: [
        {
          id: "headerValue",
          label: "Header Value",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "includeSubDomains",
          label: "Include Sub Domains",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = hstsIncludeSubDomainsFlagTool.execute;
export default hstsIncludeSubDomainsFlagTool;

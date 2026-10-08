import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly name: string;
  readonly email: string;
  readonly url: string;
};
export type Output = { readonly personString: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", maxLength: 8192, minLength: 1 },
    email: { type: "string", maxLength: 8192 },
    url: { type: "string", maxLength: 8192 },
  },
  required: ["name", "email", "url"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { personString: { type: "string", maxLength: 8192 } },
  required: ["personString"],
} as const;
/** Format explicit package-person fields as name, optional email, and optional URL without validating contact ownership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { name, email, url } = request;
  const compute = (): Output => {
    H.domain(name.length > 0 && !/[<>\r\n()]/.test(name), "name");
    H.domain(!/[<>\r\n()]/.test(email), "email");
    H.domain(!/[<>\r\n()]/.test(url), "url");
    return {
      personString:
        name +
        (email ? " <" + email + ">" : "") +
        (url ? " (" + url + ")" : ""),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    name: "A. Maintainer",
    email: "a@example.test",
    url: "https://example.test",
  },
  output: {
    personString: "A. Maintainer <a@example.test> (https://example.test)",
  },
} satisfies ToolExample<Input, Output>;
export const packageJsonPersonStringFieldsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["development", "software development", "computer science"],
      keywords: ["software development", "computer science"],
    },
    id: "development/package-json-person-string-fields",
    title: "Package JSON Person String Fields",
    description:
      "Format explicit package-person fields as name, optional email, and optional URL without validating contact ownership.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string", maxLength: 8192, minLength: 1 },
        email: { type: "string", maxLength: 8192 },
        url: { type: "string", maxLength: 8192 },
      },
      required: ["name", "email", "url"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { personString: { type: "string", maxLength: 8192 } },
      required: ["personString"],
    },
    ports: {
      inputs: [
        {
          id: "name",
          label: "Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "email",
          label: "Email",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "url",
          label: "Url",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "personString",
          label: "Person String",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = packageJsonPersonStringFieldsTool.execute;
export default packageJsonPersonStringFieldsTool;

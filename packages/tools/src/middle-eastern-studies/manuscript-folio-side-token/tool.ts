import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly prefix: string;
  readonly rectoSuffix: string;
  readonly versoSuffix: string;
  readonly pagination: boolean;
  readonly source: string;
};
export type Output = {
  readonly number: number;
  readonly numberToken: string;
  readonly side: string;
  readonly sourceKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    prefix: { type: "string", maxLength: 8192 },
    rectoSuffix: { type: "string", maxLength: 8192 },
    versoSuffix: { type: "string", maxLength: 8192 },
    pagination: { type: "boolean" },
    source: { type: "string", maxLength: 8192 },
  },
  required: [
    "token",
    "prefix",
    "rectoSuffix",
    "versoSuffix",
    "pagination",
    "source",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    number: { type: "integer" },
    numberToken: { type: "string", maxLength: 8192 },
    side: { type: "string", maxLength: 8192 },
    sourceKey: { type: "string", maxLength: 8192 },
  },
  required: ["number", "numberToken", "side", "sourceKey"],
} as const;
/** Parse a supplied public manuscript prefix/digit/side grammar while distinguishing foliation from modern pagination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, prefix, rectoSuffix, versoSuffix, pagination, source } =
    request;
  const compute = (): Output => {
    H.domain(
      token.startsWith(prefix) &&
        rectoSuffix.length > 0 &&
        versoSuffix.length > 0 &&
        rectoSuffix !== versoSuffix,
    );
    let body = token.slice(prefix.length),
      side = "page";
    if (!pagination) {
      const matches = [rectoSuffix, versoSuffix].filter((x) =>
        body.endsWith(x),
      );
      H.domain(matches.length === 1, "token");
      const suffix = matches[0];
      side = suffix === rectoSuffix ? "recto" : "verso";
      body = body.slice(0, -suffix.length);
    }
    H.domain(/^\d+(?![\s\S])/.test(body), "token");
    const number = Number(body);
    H.integer(number, 1);
    return {
      number,
      numberToken: body,
      side,
      sourceKey: JSON.stringify([source, token]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    token: "f.012v",
    prefix: "f.",
    rectoSuffix: "r",
    versoSuffix: "v",
    pagination: false,
    source: "MS-A",
  },
  output: {
    number: 12,
    numberToken: "012",
    side: "verso",
    sourceKey: '["MS-A","f.012v"]',
  },
} satisfies ToolExample<Input, Output>;
export const manuscriptFolioSideTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "middle-eastern-studies/manuscript-folio-side-token",
    title: "Manuscript Folio Side Token Tool",
    description:
      "Parse a supplied public manuscript prefix/digit/side grammar while distinguishing foliation from modern pagination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        prefix: { type: "string", maxLength: 8192 },
        rectoSuffix: { type: "string", maxLength: 8192 },
        versoSuffix: { type: "string", maxLength: 8192 },
        pagination: { type: "boolean" },
        source: { type: "string", maxLength: 8192 },
      },
      required: [
        "token",
        "prefix",
        "rectoSuffix",
        "versoSuffix",
        "pagination",
        "source",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        number: { type: "integer" },
        numberToken: { type: "string", maxLength: 8192 },
        side: { type: "string", maxLength: 8192 },
        sourceKey: { type: "string", maxLength: 8192 },
      },
      required: ["number", "numberToken", "side", "sourceKey"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "prefix",
          label: "Prefix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rectoSuffix",
          label: "Recto Suffix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "versoSuffix",
          label: "Verso Suffix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "pagination",
          label: "Pagination",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "number", label: "Number", valueType: { type: "integer" } },
        {
          id: "numberToken",
          label: "Number Token",
          valueType: { type: "string" },
        },
        { id: "side", label: "Side", valueType: { type: "string" } },
        { id: "sourceKey", label: "Source Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = manuscriptFolioSideTokenTool.execute;
export default manuscriptFolioSideTokenTool;

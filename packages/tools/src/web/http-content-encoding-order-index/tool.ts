import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly encodings: readonly string[];
  readonly index: number;
};
export type Output = {
  readonly encoding: string;
  readonly decodeIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    encodings: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    index: { type: "integer", minimum: 0 },
  },
  required: ["encodings", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    encoding: { type: "string", maxLength: 8192 },
    decodeIndex: { type: "integer" },
  },
  required: ["encoding", "decodeIndex"],
} as const;
/** Calculate http content encoding order index from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { encodings, index } = input;
  const compute = (): Output => {
    H.domain(
      encodings.every((x) => /^[!#$%&*+.^_`|~0-9A-Za-z-]+(?![\s\S])/.test(x)),
    );
    H.integer(index, 0, encodings.length - 1);
    return {
      encoding: encodings[index].toLowerCase(),
      decodeIndex: encodings.length - 1 - index,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { encodings: ["gzip", "br"], index: 0 },
  output: { encoding: "gzip", decodeIndex: 1 },
} satisfies ToolExample<Input, Output>;
export const httpContentEncodingOrderIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/http-content-encoding-order-index",
    title: "HTTP Content Encoding Order Index Tool",
    description:
      "Calculate http content encoding order index from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        encodings: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        index: { type: "integer", minimum: 0 },
      },
      required: ["encodings", "index"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        encoding: { type: "string", maxLength: 8192 },
        decodeIndex: { type: "integer" },
      },
      required: ["encoding", "decodeIndex"],
    },
    ports: {
      inputs: [
        {
          id: "encodings",
          label: "Encodings",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "encoding", label: "Encoding", valueType: { type: "string" } },
        {
          id: "decodeIndex",
          label: "Decode Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = httpContentEncodingOrderIndexTool.execute;
export default httpContentEncodingOrderIndexTool;

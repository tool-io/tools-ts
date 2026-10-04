import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly fields: readonly string[] };
export type Output = {
  readonly star: boolean;
  readonly fields: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["fields"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    star: { type: "boolean" },
    fields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["star", "fields"],
} as const;
/** Calculate http vary header star dominance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fields } = request;
  const compute = (): Output => {
    H.domain(
      fields.every(
        (x) => x === "*" || /^[!#$%&'*+.^_`|~0-9A-Za-z-]+(?![\s\S])/.test(x),
      ),
      "fields",
      "Use HTTP field-name tokens or the wildcard member *.",
    );
    const star = fields.includes("*");
    return {
      star,
      fields: star ? ["*"] : [...new Set(fields.map((x) => x.toLowerCase()))],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fields: ["Accept", "*", "Origin"] },
  output: { star: true, fields: ["*"] },
} satisfies ToolExample<Input, Output>;
export const httpVaryHeaderStarDominanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/http-vary-header-star-dominance",
    title: "HTTP Vary Header Star Dominance Tool",
    description:
      "Calculate http vary header star dominance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fields: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["fields"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        star: { type: "boolean" },
        fields: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["star", "fields"],
    },
    ports: {
      inputs: [
        {
          id: "fields",
          label: "Fields",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "star", label: "Star", valueType: { type: "boolean" } },
        {
          id: "fields",
          label: "Fields",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = httpVaryHeaderStarDominanceTool.execute;
export default httpVaryHeaderStarDominanceTool;

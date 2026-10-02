import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly operatorPath: readonly string[];
  readonly suppliedModalOperators: readonly string[];
};
export type Output = {
  readonly modalDepth: number;
  readonly pathLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    operatorPath: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedModalOperators: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["operatorPath", "suppliedModalOperators"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modalDepth: { type: "integer" },
    pathLength: { type: "integer" },
  },
  required: ["modalDepth", "pathLength"],
} as const;
/** Count modal operators along one caller-supplied syntax-tree path; does not parse a complete modal formula. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { operatorPath, suppliedModalOperators } = request;
  const compute = (): Output => {
    return {
      modalDepth: operatorPath.filter((x) => suppliedModalOperators.includes(x))
        .length,
      pathLength: operatorPath.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    operatorPath: ["box", "not", "diamond"],
    suppliedModalOperators: ["box", "diamond"],
  },
  output: { modalDepth: 2, pathLength: 3 },
} satisfies ToolExample<Input, Output>;
export const modalOperatorNestingDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/modal-operator-nesting-depth",
    title: "Modal Operator Nesting Depth Tool",
    description:
      "Count modal operators along one caller-supplied syntax-tree path; does not parse a complete modal formula.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        operatorPath: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedModalOperators: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["operatorPath", "suppliedModalOperators"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modalDepth: { type: "integer" },
        pathLength: { type: "integer" },
      },
      required: ["modalDepth", "pathLength"],
    },
    ports: {
      inputs: [
        {
          id: "operatorPath",
          label: "Operator Path",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedModalOperators",
          label: "Supplied Modal Operators",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "modalDepth",
          label: "Modal Depth",
          valueType: { type: "integer" },
        },
        {
          id: "pathLength",
          label: "Path Length",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = modalOperatorNestingDepthTool.execute;
export default modalOperatorNestingDepthTool;

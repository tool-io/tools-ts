import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstBinder: string;
  readonly firstBody: readonly string[];
  readonly secondBinder: string;
  readonly secondBody: readonly string[];
};
export type Output = { readonly equivalent: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstBinder: { type: "string", maxLength: 8192 },
    firstBody: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    secondBinder: { type: "string", maxLength: 8192 },
    secondBody: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["firstBinder", "firstBody", "secondBinder", "secondBody"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equivalent: { type: "boolean" } },
  required: ["equivalent"],
} as const;
/** Compare flat single-binder token bodies, rejecting potential free-variable capture; nested binders are outside this model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstBinder, firstBody, secondBinder, secondBody } = request;
  const compute = (): Output => {
    H.domain(firstBinder.length > 0 && secondBinder.length > 0);
    H.domain(
      !firstBody.some((t) => t === secondBinder && t !== firstBinder) &&
        !secondBody.some((t) => t === firstBinder && t !== secondBinder),
    );
    return {
      equivalent:
        firstBody.length === secondBody.length &&
        firstBody.every((t, i) =>
          t === firstBinder
            ? secondBody[i] === secondBinder
            : t === secondBody[i],
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstBinder: "x",
    firstBody: ["P", "x"],
    secondBinder: "y",
    secondBody: ["P", "y"],
  },
  output: { equivalent: true },
} satisfies ToolExample<Input, Output>;
export const alphaEquivalenceBoundVariablePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/alpha-equivalence-bound-variable-pair",
    title: "Alpha Equivalence Bound Variable Pair Tool",
    description:
      "Compare flat single-binder token bodies, rejecting potential free-variable capture; nested binders are outside this model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstBinder: { type: "string", maxLength: 8192 },
        firstBody: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        secondBinder: { type: "string", maxLength: 8192 },
        secondBody: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["firstBinder", "firstBody", "secondBinder", "secondBody"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { equivalent: { type: "boolean" } },
      required: ["equivalent"],
    },
    ports: {
      inputs: [
        {
          id: "firstBinder",
          label: "First Binder",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstBody",
          label: "First Body",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "secondBinder",
          label: "Second Binder",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondBody",
          label: "Second Body",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "equivalent",
          label: "Equivalent",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = alphaEquivalenceBoundVariablePairTool.execute;
export default alphaEquivalenceBoundVariablePairTool;

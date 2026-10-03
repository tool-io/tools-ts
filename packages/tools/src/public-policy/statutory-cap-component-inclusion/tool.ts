import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly components: readonly number[];
  readonly included: readonly boolean[];
  readonly suppliedCap: number;
};
export type Output = {
  readonly includedTotal: number;
  readonly excess: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    components: { type: "array", maxItems: 256, items: { type: "number" } },
    included: { type: "array", maxItems: 256, items: { type: "boolean" } },
    suppliedCap: { type: "number", minimum: 0 },
  },
  required: ["components", "included", "suppliedCap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { includedTotal: { type: "number" }, excess: { type: "number" } },
  required: ["includedTotal", "excess"],
} as const;
/** Apply supplied component-inclusion flags and a supplied cap; no statutory classification is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { components, included, suppliedCap } = request;
  const compute = (): Output => {
    H.sameLength(components, included);
    H.domain(components.every((x) => x >= 0) && suppliedCap >= 0);
    return {
      includedTotal: components.reduce(
        (s, x, i) => s + (included[i] ? x : 0),
        0,
      ),
      excess: Math.max(
        0,
        components.reduce((s, x, i) => s + (included[i] ? x : 0), 0) -
          suppliedCap,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    components: [20, 40, 30],
    included: [true, false, true],
    suppliedCap: 40,
  },
  output: { includedTotal: 50, excess: 10 },
} satisfies ToolExample<Input, Output>;
export const statutoryCapComponentInclusionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/statutory-cap-component-inclusion",
    title: "Statutory Cap Component Inclusion Tool",
    description:
      "Apply supplied component-inclusion flags and a supplied cap; no statutory classification is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        components: { type: "array", maxItems: 256, items: { type: "number" } },
        included: { type: "array", maxItems: 256, items: { type: "boolean" } },
        suppliedCap: { type: "number", minimum: 0 },
      },
      required: ["components", "included", "suppliedCap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        includedTotal: { type: "number" },
        excess: { type: "number" },
      },
      required: ["includedTotal", "excess"],
    },
    ports: {
      inputs: [
        {
          id: "components",
          label: "Components",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "included",
          label: "Included",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "suppliedCap",
          label: "Supplied Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "includedTotal",
          label: "Included Total",
          valueType: { type: "number" },
        },
        { id: "excess", label: "Excess", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = statutoryCapComponentInclusionTool.execute;
export default statutoryCapComponentInclusionTool;

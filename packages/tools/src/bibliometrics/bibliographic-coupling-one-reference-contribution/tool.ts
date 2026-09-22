import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstReferences: readonly string[];
  readonly secondReferences: readonly string[];
  readonly reference: string;
  readonly fractionalWeight: number;
};
export type Output = {
  readonly shared: boolean;
  readonly contribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstReferences: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    secondReferences: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    reference: { type: "string", maxLength: 8192 },
    fractionalWeight: { type: "number", minimum: 0 },
  },
  required: [
    "firstReferences",
    "secondReferences",
    "reference",
    "fractionalWeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shared: { type: "boolean" }, contribution: { type: "number" } },
  required: ["shared", "contribution"],
} as const;
/** Calculate bibliographic coupling one reference contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstReferences, secondReferences, reference, fractionalWeight } =
    request;
  const compute = (): Output => {
    H.domain(fractionalWeight >= 0);
    const shared =
      firstReferences.includes(reference) &&
      secondReferences.includes(reference);
    return { shared, contribution: shared ? fractionalWeight : 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstReferences: ["A", "B"],
    secondReferences: ["B", "C"],
    reference: "B",
    fractionalWeight: 0.5,
  },
  output: { shared: true, contribution: 0.5 },
} satisfies ToolExample<Input, Output>;
export const bibliographicCouplingOneReferenceContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bibliometrics/bibliographic-coupling-one-reference-contribution",
      title: "Bibliographic Coupling One Reference Contribution Tool",
      description:
        "Calculate bibliographic coupling one reference contribution from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstReferences: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          secondReferences: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          reference: { type: "string", maxLength: 8192 },
          fractionalWeight: { type: "number", minimum: 0 },
        },
        required: [
          "firstReferences",
          "secondReferences",
          "reference",
          "fractionalWeight",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          shared: { type: "boolean" },
          contribution: { type: "number" },
        },
        required: ["shared", "contribution"],
      },
      ports: {
        inputs: [
          {
            id: "firstReferences",
            label: "First References",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "secondReferences",
            label: "Second References",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "reference",
            label: "Reference",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "fractionalWeight",
            label: "Fractional Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "shared", label: "Shared", valueType: { type: "boolean" } },
          {
            id: "contribution",
            label: "Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = bibliographicCouplingOneReferenceContributionTool.execute;
export default bibliographicCouplingOneReferenceContributionTool;

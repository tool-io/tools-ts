import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly suppliedGravity: number;
  readonly stepHeights: readonly number[];
  readonly referenceHeight: number;
};
export type Output = {
  readonly work: number;
  readonly referenceStepEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", minimum: 0 },
    suppliedGravity: { type: "number", minimum: 0 },
    stepHeights: { type: "array", maxItems: 256, items: { type: "number" } },
    referenceHeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["mass", "suppliedGravity", "stepHeights", "referenceHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    work: { type: "number" },
    referenceStepEquivalent: { type: "number" },
  },
  required: ["work", "referenceStepEquivalent"],
} as const;
/** Ideal supplied gravitational work and reference-height equivalents without a rehabilitation exercise prescription. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, suppliedGravity, stepHeights, referenceHeight } = request;
  const compute = (): Output => {
    H.domain(
      mass >= 0 && suppliedGravity >= 0 && stepHeights.every((x) => x >= 0),
    );
    H.positive(referenceHeight);
    return {
      work: mass * suppliedGravity * stepHeights.reduce((a, b) => a + b, 0),
      referenceStepEquivalent:
        stepHeights.reduce((a, b) => a + b, 0) / referenceHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    mass: 20,
    suppliedGravity: 10,
    stepHeights: [0.1, 0.2],
    referenceHeight: 0.1,
  },
  output: {
    work: 60.00000000000001,
    referenceStepEquivalent: 3.0000000000000004,
  },
} satisfies ToolExample<Input, Output>;
export const rehabStepWorkReferenceHeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiotherapy/rehab-step-work-reference-height",
    title: "Rehab Step Work Reference Height Tool",
    description:
      "Ideal supplied gravitational work and reference-height equivalents without a rehabilitation exercise prescription.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mass: { type: "number", minimum: 0 },
        suppliedGravity: { type: "number", minimum: 0 },
        stepHeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        referenceHeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["mass", "suppliedGravity", "stepHeights", "referenceHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        work: { type: "number" },
        referenceStepEquivalent: { type: "number" },
      },
      required: ["work", "referenceStepEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "mass",
          label: "Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedGravity",
          label: "Supplied Gravity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stepHeights",
          label: "Step Heights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceHeight",
          label: "Reference Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "work", label: "Work", valueType: { type: "number" } },
        {
          id: "referenceStepEquivalent",
          label: "Reference Step Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rehabStepWorkReferenceHeightTool.execute;
export default rehabStepWorkReferenceHeightTool;

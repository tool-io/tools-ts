import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capLength: number;
  readonly armholeLength: number;
  readonly sectionWeights: readonly number[];
};
export type Output = {
  readonly ease: number;
  readonly allocations: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capLength: { type: "number" },
    armholeLength: { type: "number", exclusiveMinimum: 0 },
    sectionWeights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["capLength", "armholeLength", "sectionWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ease: { type: "number" },
    allocations: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["ease", "allocations"],
} as const;
/** Calculate sleeve cap ease per section from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capLength, armholeLength, sectionWeights } = request;
  const compute = (): Output => {
    H.domain(
      capLength >= armholeLength &&
        armholeLength > 0 &&
        sectionWeights.length > 0 &&
        sectionWeights.every((w) => w >= 0) &&
        sectionWeights.some((w) => w > 0),
    );
    return {
      ease: capLength - armholeLength,
      allocations: sectionWeights.map(
        (w) =>
          ((capLength - armholeLength) * w) /
          sectionWeights.reduce((a, b) => a + b, 0),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capLength: 52, armholeLength: 48, sectionWeights: [1, 2, 1] },
  output: { ease: 4, allocations: [1, 2, 1] },
} satisfies ToolExample<Input, Output>;
export const sleeveCapEasePerSectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/sleeve-cap-ease-per-section",
    title: "Sleeve Cap Ease Per Section Tool",
    description:
      "Calculate sleeve cap ease per section from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capLength: { type: "number" },
        armholeLength: { type: "number", exclusiveMinimum: 0 },
        sectionWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["capLength", "armholeLength", "sectionWeights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ease: { type: "number" },
        allocations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["ease", "allocations"],
    },
    ports: {
      inputs: [
        {
          id: "capLength",
          label: "Cap Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "armholeLength",
          label: "Armhole Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sectionWeights",
          label: "Section Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "ease", label: "Ease", valueType: { type: "number" } },
        {
          id: "allocations",
          label: "Allocations",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = sleeveCapEasePerSectionTool.execute;
export default sleeveCapEasePerSectionTool;

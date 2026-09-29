import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstIndex: number;
  readonly lastIndex: number;
  readonly skipped: readonly number[];
  readonly duplicateSkipped: number;
};
export type Output = {
  readonly nominalSections: number;
  readonly retainedSections: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstIndex: { type: "integer", minimum: 0 },
    lastIndex: { type: "integer" },
    skipped: { type: "array", maxItems: 256, items: { type: "integer" } },
    duplicateSkipped: { type: "integer", minimum: 0 },
  },
  required: ["firstIndex", "lastIndex", "skipped", "duplicateSkipped"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalSections: { type: "integer" },
    retainedSections: { type: "integer" },
  },
  required: ["nominalSections", "retainedSections"],
} as const;
/** Calculate section ribbon skipped count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstIndex, lastIndex, skipped, duplicateSkipped } = request;
  const compute = (): Output => {
    H.integer(firstIndex, 0);
    H.integer(lastIndex, firstIndex);
    H.integer(duplicateSkipped, 0);
    H.domain(
      skipped.every((x) => x >= firstIndex && x <= lastIndex) &&
        skipped.length - new Set(skipped).size === duplicateSkipped,
    );
    return {
      nominalSections: lastIndex - firstIndex + 1,
      retainedSections: lastIndex - firstIndex + 1 - new Set(skipped).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstIndex: 10,
    lastIndex: 20,
    skipped: [12, 15, 15],
    duplicateSkipped: 1,
  },
  output: { nominalSections: 11, retainedSections: 9 },
} satisfies ToolExample<Input, Output>;
export const sectionRibbonSkippedCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/section-ribbon-skipped-count",
    title: "Section Ribbon Skipped Count Tool",
    description:
      "Calculate section ribbon skipped count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstIndex: { type: "integer", minimum: 0 },
        lastIndex: { type: "integer" },
        skipped: { type: "array", maxItems: 256, items: { type: "integer" } },
        duplicateSkipped: { type: "integer", minimum: 0 },
      },
      required: ["firstIndex", "lastIndex", "skipped", "duplicateSkipped"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalSections: { type: "integer" },
        retainedSections: { type: "integer" },
      },
      required: ["nominalSections", "retainedSections"],
    },
    ports: {
      inputs: [
        {
          id: "firstIndex",
          label: "First Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastIndex",
          label: "Last Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "skipped",
          label: "Skipped",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "duplicateSkipped",
          label: "Duplicate Skipped",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nominalSections",
          label: "Nominal Sections",
          valueType: { type: "integer" },
        },
        {
          id: "retainedSections",
          label: "Retained Sections",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = sectionRibbonSkippedCountTool.execute;
export default sectionRibbonSkippedCountTool;

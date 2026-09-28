import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly categoryDurations: readonly number[];
  readonly selected: readonly boolean[];
};
export type Output = {
  readonly selectedDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    categoryDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    selected: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["categoryDurations", "selected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectedDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["selectedDuration", "share", "defined"],
} as const;
/** Calculate time use social category share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { categoryDurations, selected } = request;
  const compute = (): Output => {
    H.sameLength(categoryDurations, selected);
    H.domain(categoryDurations.every((x) => x >= 0));
    return {
      selectedDuration: categoryDurations.reduce(
        (s, x, i) => s + (selected[i] ? x : 0),
        0,
      ),
      share: categoryDurations.some((x) => x > 0)
        ? categoryDurations.reduce((s, x, i) => s + (selected[i] ? x : 0), 0) /
          categoryDurations.reduce((a, b) => a + b, 0)
        : 0,
      defined: categoryDurations.some((x) => x > 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { categoryDurations: [2, 6, 2], selected: [true, false, true] },
  output: { selectedDuration: 4, share: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const timeUseSocialCategoryShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/time-use-social-category-share",
    title: "Time Use Social Category Share Tool",
    description:
      "Calculate time use social category share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        categoryDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        selected: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["categoryDurations", "selected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selectedDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["selectedDuration", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "categoryDurations",
          label: "Category Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "selected",
          label: "Selected",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "selectedDuration",
          label: "Selected Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = timeUseSocialCategoryShareTool.execute;
export default timeUseSocialCategoryShareTool;

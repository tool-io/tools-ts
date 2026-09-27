import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstOptions: readonly string[];
  readonly secondOptions: readonly string[];
  readonly selectedLabel: string;
};
export type Output = {
  readonly firstIndex: number;
  readonly secondIndex: number;
  readonly knownInBoth: boolean;
  readonly positionGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOptions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    secondOptions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    selectedLabel: { type: "string", maxLength: 8192 },
  },
  required: ["firstOptions", "secondOptions", "selectedLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstIndex: { type: "integer" },
    secondIndex: { type: "integer" },
    knownInBoth: { type: "boolean" },
    positionGap: { type: "integer" },
  },
  required: ["firstIndex", "secondIndex", "knownInBoth", "positionGap"],
} as const;
/** Compare positions of an explicit self-report option without imposing an identity taxonomy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstOptions, secondOptions, selectedLabel } = request;
  const compute = (): Output => {
    H.domain(
      new Set(firstOptions).size === firstOptions.length &&
        new Set(secondOptions).size === secondOptions.length,
    );
    return (() => {
      const firstIndex = firstOptions.indexOf(selectedLabel),
        secondIndex = secondOptions.indexOf(selectedLabel),
        knownInBoth = firstIndex >= 0 && secondIndex >= 0;
      return {
        firstIndex,
        secondIndex,
        knownInBoth,
        positionGap: knownInBoth ? secondIndex - firstIndex : 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstOptions: ["A", "B"],
    secondOptions: ["B", "A"],
    selectedLabel: "A",
  },
  output: { firstIndex: 0, secondIndex: 1, knownInBoth: true, positionGap: 1 },
} satisfies ToolExample<Input, Output>;
export const selfReportOptionPositionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gender-studies/self-report-option-position-gap",
    title: "Self Report Option Position Gap Tool",
    description:
      "Compare positions of an explicit self-report option without imposing an identity taxonomy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOptions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        secondOptions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        selectedLabel: { type: "string", maxLength: 8192 },
      },
      required: ["firstOptions", "secondOptions", "selectedLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstIndex: { type: "integer" },
        secondIndex: { type: "integer" },
        knownInBoth: { type: "boolean" },
        positionGap: { type: "integer" },
      },
      required: ["firstIndex", "secondIndex", "knownInBoth", "positionGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstOptions",
          label: "First Options",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "secondOptions",
          label: "Second Options",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "selectedLabel",
          label: "Selected Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "firstIndex",
          label: "First Index",
          valueType: { type: "integer" },
        },
        {
          id: "secondIndex",
          label: "Second Index",
          valueType: { type: "integer" },
        },
        {
          id: "knownInBoth",
          label: "Known In Both",
          valueType: { type: "boolean" },
        },
        {
          id: "positionGap",
          label: "Position Gap",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = selfReportOptionPositionGapTool.execute;
export default selfReportOptionPositionGapTool;

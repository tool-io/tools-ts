import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly labelIndex: number;
  readonly classCount: number;
};
export type Output = { readonly targets: readonly boolean[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labelIndex: { type: "integer", minimum: 0 },
    classCount: { type: "integer", minimum: 2, maximum: 256 },
  },
  required: ["labelIndex", "classCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targets: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["targets"],
} as const;
/** Compute ordinal cumulative label target from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { labelIndex, classCount } = input;
  const compute = (): Output => {
    integer(classCount, 2, 256);
    integer(labelIndex, 0, classCount - 1);
    return {
      targets: Array.from({ length: classCount - 1 }, (_, i) => labelIndex > i),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { labelIndex: 2, classCount: 4 },
  output: { targets: [true, true, false] },
} satisfies ToolExample<Input, Output>;
export const ordinalCumulativeLabelTargetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "classification/ordinal-cumulative-label-target",
  title: "Ordinal Cumulative Label Target Tool",
  description:
    "Compute ordinal cumulative label target from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "labelIndex",
        label: "Label Index",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "classCount",
        label: "Class Count",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "targets",
        label: "Targets",
        valueType: { type: "list", items: { type: "boolean" } },
      },
    ],
  },
});
export const run = ordinalCumulativeLabelTargetTool.execute;
export default ordinalCumulativeLabelTargetTool;

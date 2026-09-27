import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly panelWidth: number;
  readonly repeatWidth: number;
};
export type Output = {
  readonly wholeRepeats: number;
  readonly remainder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    panelWidth: { type: "number", minimum: 0 },
    repeatWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["panelWidth", "repeatWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wholeRepeats: { type: "integer" },
    remainder: { type: "number" },
  },
  required: ["wholeRepeats", "remainder"],
} as const;
/** Calculate pleat repeat partial panel remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { panelWidth, repeatWidth } = request;
  const compute = (): Output => {
    H.domain(panelWidth >= 0);
    H.positive(repeatWidth);
    return {
      wholeRepeats: Math.floor(panelWidth / repeatWidth),
      remainder: panelWidth % repeatWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { panelWidth: 53, repeatWidth: 10 },
  output: { wholeRepeats: 5, remainder: 3 },
} satisfies ToolExample<Input, Output>;
export const pleatRepeatPartialPanelRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/pleat-repeat-partial-panel-remainder",
    title: "Pleat Repeat Partial Panel Remainder Tool",
    description:
      "Calculate pleat repeat partial panel remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        panelWidth: { type: "number", minimum: 0 },
        repeatWidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["panelWidth", "repeatWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wholeRepeats: { type: "integer" },
        remainder: { type: "number" },
      },
      required: ["wholeRepeats", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "panelWidth",
          label: "Panel Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "repeatWidth",
          label: "Repeat Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wholeRepeats",
          label: "Whole Repeats",
          valueType: { type: "integer" },
        },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pleatRepeatPartialPanelRemainderTool.execute;
export default pleatRepeatPartialPanelRemainderTool;

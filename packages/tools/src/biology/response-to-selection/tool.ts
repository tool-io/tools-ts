import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ResponseToSelectionInput = {
  readonly h2Number: number;
  readonly selectionDifferenceS: number;
};

export type ResponseToSelectionOutput = {
  readonly responseR: number;
};

export const responseToSelectionExample = {
  input: { h2Number: 0.5, selectionDifferenceS: 4 },
  output: { responseR: 2 },
} satisfies ToolExample<ResponseToSelectionInput, ResponseToSelectionOutput>;

export const responseToSelectionTool = createSimpleTool({
  id: "biology/response-to-selection",
  title: "Response To Selection",
  description:
    "Compute the breeder's equation response to selection as heritability times the signed selection differential.",
  inputs: [
    {
      id: "h2Number",
      label: "Heritability",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      description:
        "Signed difference between selected parents mean and population mean.",
      id: "selectionDifferenceS",
      label: "Selection differential",
      kind: "number",
    },
  ],
  outputs: [
    { id: "responseR", label: "Response to selection", kind: "number" },
  ],
  calculate: (input) => ({
    responseR:
      (input.h2Number as number) * (input.selectionDifferenceS as number),
  }),
});
export const runResponseToSelection = responseToSelectionTool.execute;
export default responseToSelectionTool;

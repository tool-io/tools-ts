import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SporePrintColorMapperInput = {
  readonly color:
    | "black"
    | "cream"
    | "green"
    | "pink"
    | "purple-brown"
    | "rust-brown"
    | "white"
    | "yellow";
};

export type SporePrintColorMapperOutput = {
  readonly printColor: string;
};

export const sporePrintColorMapperExample = {
  input: { color: "white" },
  output: { printColor: "white" },
} satisfies ToolExample<
  SporePrintColorMapperInput,
  SporePrintColorMapperOutput
>;

export const sporePrintColorMapperTool = createSimpleTool({
  id: "mycology/spore-print-color-mapper",
  title: "Spore Print Color Mapper",
  description:
    "Validate and record an observed spore-print color without inferring a taxonomic group from color alone.",
  inputs: [
    {
      enum: [
        "white",
        "cream",
        "yellow",
        "green",
        "pink",
        "purple-brown",
        "rust-brown",
        "black",
      ],
      id: "color",
      kind: "string",
      label: "Spore print color",
    },
  ],
  outputs: [{ id: "printColor", label: "Print color", kind: "string" }],
  calculate: (input) => ({
    printColor: input.color as string,
  }),
});
export const runSporePrintColorMapper = sporePrintColorMapperTool.execute;
export default sporePrintColorMapperTool;

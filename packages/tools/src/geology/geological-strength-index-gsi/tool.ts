import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GeologicalStrengthIndexGsiInput = {
  readonly rmr76: number;
};

export type GeologicalStrengthIndexGsiOutput = {
  readonly gsi: number;
};

export const calculateGeologicalStrengthIndexGsi = (
  input: GeologicalStrengthIndexGsiInput,
): GeologicalStrengthIndexGsiOutput => {
  const { rmr76 } = input;
  if (!(rmr76 > 23))
    simpleError(
      "rmr76",
      "The GSI = RMR76 - 5 relation applies only for RMR76 greater than 23.",
      "out_of_validity",
    );
  return { gsi: rmr76 - 5 };
};

export const geologicalStrengthIndexGsiExample = {
  input: { rmr76: 65 },
  output: { gsi: 60 },
} satisfies ToolExample<
  GeologicalStrengthIndexGsiInput,
  GeologicalStrengthIndexGsiOutput
>;

export const geologicalStrengthIndexGsiTool = createSimpleTool({
  id: "geology/geological-strength-index-gsi",
  title: "Geological Strength Index GSI Calculator",
  description:
    "Estimate the Hoek Geological Strength Index from the 1976 Rock Mass Rating using the published relation GSI = RMR76 - 5 (valid for RMR76 > 23).",
  inputs: [
    {
      description: "Bieniawski 1976 rock mass rating (must exceed 23).",
      id: "rmr76",
      kind: "number",
      label: "RMR76",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Geological Strength Index GSI.",
      id: "gsi",
      kind: "number",
      label: "GSI",
    },
  ],
  calculate: (input) =>
    calculateGeologicalStrengthIndexGsi(
      input as unknown as GeologicalStrengthIndexGsiInput,
    ),
});

export const runGeologicalStrengthIndexGsi =
  geologicalStrengthIndexGsiTool.execute;
export default geologicalStrengthIndexGsiTool;

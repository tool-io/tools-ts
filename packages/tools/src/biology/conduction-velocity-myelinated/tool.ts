import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const conductionVelocityMyelinatedExample = {
  input: { diameterUm: 10 },
  output: { conductionVelocityMPerS: 60 },
} satisfies ToolExample<
  { readonly diameterUm: number },
  { readonly conductionVelocityMPerS: number }
>;

export const conductionVelocityMyelinatedTool = createSimpleTool({
  id: "biology/conduction-velocity-myelinated",
  title: "Conduction Velocity",
  description:
    "Estimate myelinated axon conduction velocity with the documented linear factor of about 6 metres per second per micrometre of fibre diameter.",
  inputs: [
    {
      description:
        "Myelinated fibre diameter in micrometres; must be greater than zero.",
      id: "diameterUm",
      label: "Fibre diameter",
      kind: "number",
      unit: "µm",
    },
  ],
  outputs: [
    {
      description: "Action potential conduction velocity in metres per second.",
      id: "conductionVelocityMPerS",
      label: "Conduction velocity",
      kind: "number",
      unit: "m/s",
    },
  ],
  calculate: (input) => {
    const diameterUm = input.diameterUm as number;
    if (!(diameterUm > 0))
      simpleError(
        "diameterUm",
        "The fibre diameter must be greater than zero.",
      );
    return { conductionVelocityMPerS: diameterUm * 6 };
  },
});
export const runConductionVelocityMyelinated =
  conductionVelocityMyelinatedTool.execute;
export default conductionVelocityMyelinatedTool;

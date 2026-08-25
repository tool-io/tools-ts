import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const conductionVelocityUnmyelinatedExample = {
  input: { diameterUm: 10 },
  output: { conductionVelocityMPerS: 1.5811388300841898 },
} satisfies ToolExample<
  { readonly diameterUm: number },
  { readonly conductionVelocityMPerS: number }
>;

export const conductionVelocityUnmyelinatedTool = createSimpleTool({
  id: "biology/conduction-velocity-unmyelinated",
  title: "Unmyelinated Conduction Velocity",
  description:
    "Estimate unmyelinated axon conduction velocity as 0.5 times the square root of fibre diameter in micrometres. The coefficient is empirical and varies with membrane properties and temperature.",
  inputs: [
    {
      description:
        "Unmyelinated fibre diameter in micrometres; must be greater than zero.",
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
        "invalid_diameter",
      );
    return { conductionVelocityMPerS: Math.sqrt(diameterUm) * 0.5 };
  },
});
export const runConductionVelocityUnmyelinated =
  conductionVelocityUnmyelinatedTool.execute;
export default conductionVelocityUnmyelinatedTool;

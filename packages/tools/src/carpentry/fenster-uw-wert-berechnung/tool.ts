import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type WindowUwValueInput = {
  readonly frameShare?: number;
  readonly frameUValue?: number;
  readonly glassUValue?: number;
};

export type WindowUwValueOutput = {
  readonly uwWPerM2K: number;
};

export const windowUwValueExample = {
  input: { frameShare: 0.25, frameUValue: 1.3, glassUValue: 1.1 },
  output: { uwWPerM2K: 1.1500000000000001 },
} satisfies ToolExample<WindowUwValueInput, WindowUwValueOutput>;

export const windowUwValueTool = createSimpleTool({
  id: "carpentry/fenster-uw-wert-berechnung",
  title: "Window Uw Value Calculator",
  description:
    "Compute the window Uw value from the glass U value, frame U value, and frame share.",
  inputs: [
    {
      default: 1.1,
      description: "Thermal transmittance of the glazing in W/(m²K).",
      id: "glassUValue",
      kind: "number",
      label: "Glass U value",
      maximum: 3,
      minimum: 0.4,
      unit: "W/(m²K)",
    },
    {
      default: 1.3,
      description: "Thermal transmittance of the frame in W/(m²K).",
      id: "frameUValue",
      kind: "number",
      label: "Frame U value",
      maximum: 3,
      minimum: 0.6,
      unit: "W/(m²K)",
    },
    {
      default: 0.25,
      description:
        "Frame share of the window area as a fraction between 0 and 0.6.",
      id: "frameShare",
      kind: "number",
      label: "Frame share",
      maximum: 0.6,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Weighted window U value in W/(m²K).",
      id: "uwWPerM2K",
      kind: "number",
      label: "Window U value",
      unit: "W/(m²K)",
    },
  ],
  calculate: (input) => {
    const glassUValue = input.glassUValue as number;
    const frameUValue = input.frameUValue as number;
    const frameShare = input.frameShare as number;
    return {
      uwWPerM2K: frameUValue * frameShare + glassUValue * (1 - frameShare),
    };
  },
});
export const runWindowUwValue = windowUwValueTool.execute;
export default windowUwValueTool;

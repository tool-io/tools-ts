import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EviTwoBandInput = {
  readonly nirReflectance: number;
  readonly redReflectance: number;
};

export type EviTwoBandOutput = {
  readonly twoBandEvi: number;
};

export const eviTwoBandExample = {
  input: { nirReflectance: 0.5, redReflectance: 0.1 },
  output: { twoBandEvi: 0.5747126436781609 },
} satisfies ToolExample<EviTwoBandInput, EviTwoBandOutput>;

export const eviTwoBandTool = createSimpleTool({
  id: "biology/evi-two-band",
  title: "Two-Band EVI",
  description:
    "Compute the two-band Enhanced Vegetation Index as 2.5 * (NIR - red) / (NIR + 2.4 * red + 1) from reflectances between zero and one, rejecting degenerate reflectances that zero the denominator.",
  inputs: [
    {
      description: "Near-infrared reflectance between 0 and 1.",
      id: "nirReflectance",
      kind: "number",
      label: "NIR reflectance",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Red-band reflectance between 0 and 1.",
      id: "redReflectance",
      kind: "number",
      label: "Red reflectance",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Two-band EVI value; signed and typically below one.",
      id: "twoBandEvi",
      kind: "number",
      label: "Two-band EVI",
    },
  ],
  calculate: (input) => {
    const nirReflectance = input.nirReflectance as number;
    const redReflectance = input.redReflectance as number;
    const denominator = nirReflectance + 2.4 * redReflectance + 1;
    if (!(denominator !== 0))
      simpleError(
        "nirReflectance",
        "The reflectances combine to a zero denominator.",
        "degenerate_reflectances",
      );
    return {
      twoBandEvi: (2.5 * (nirReflectance - redReflectance)) / denominator,
    };
  },
});
export const runEviTwoBand = eviTwoBandTool.execute;
export default eviTwoBandTool;

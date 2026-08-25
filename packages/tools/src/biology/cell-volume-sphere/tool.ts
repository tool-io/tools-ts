import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cellVolumeSphereExample = {
  input: { radiusUm: 5 },
} satisfies ToolExample<{ readonly radiusUm: number }>;

export const cellVolumeSphereTool = createSimpleTool({
  id: "biology/cell-volume-sphere",
  title: "Cell Volume Sphere",
  description:
    "Compute the volume of a spherical cell in femtoliters, where one cubic micrometer equals one femtoliter.",
  inputs: [
    { id: "radiusUm", label: "Radius", kind: "number", unit: "\u00b5m" },
  ],
  outputs: [
    { id: "volumeFemtoliters", label: "Volume", kind: "number", unit: "fL" },
  ],
  calculate: (input) => {
    const radiusUm = input.radiusUm as number;
    if (radiusUm <= 0)
      simpleError("radiusUm", "Radius must be positive.", "invalid_radius");
    return { volumeFemtoliters: (4 / 3) * Math.PI * radiusUm ** 3 };
  },
});
export const runCellVolumeSphere = cellVolumeSphereTool.execute;
export default cellVolumeSphereTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const CUTICLE_TEXTURES = [
  "smooth",
  "viscid",
  "glutinous",
  "squamulose",
  "tomentose",
  "rimose",
  "areolate",
] as const;

export type CapCuticleTextureMapperInput = {
  readonly texture: (typeof CUTICLE_TEXTURES)[number];
};

export type CapCuticleTextureMapperOutput = {
  readonly cuticleTextureClass: CapCuticleTextureMapperInput["texture"];
  readonly interpretation: string;
};

export const capCuticleTextureMapperExample = {
  input: { texture: "viscid" },
  output: {
    cuticleTextureClass: "viscid",
    interpretation: "Sticky or tacky cap surface when moist.",
  },
} satisfies ToolExample<
  CapCuticleTextureMapperInput,
  CapCuticleTextureMapperOutput
>;

const INTERPRETATIONS: Record<CapCuticleTextureMapperInput["texture"], string> =
  {
    areolate: "Cap surface broken into small polygonal patches.",
    glutinous:
      "Cap surface coated with a conspicuously gelatinous or slimy layer.",
    rimose: "Cap surface split by radial cracks.",
    smooth: "Cap surface lacks conspicuous scales, hairs, slime, or cracking.",
    squamulose: "Cap surface bears small scales.",
    tomentose: "Cap surface is densely covered with short, matted hairs.",
    viscid: "Sticky or tacky cap surface when moist.",
  };

export const calculateCapCuticleTextureMapper = (
  input: CapCuticleTextureMapperInput,
): CapCuticleTextureMapperOutput => {
  const interpretation = INTERPRETATIONS[input.texture];
  if (interpretation === undefined)
    return simpleError(
      "texture",
      "Select a supported cap-surface texture.",
      "invalid_texture",
    );
  return { cuticleTextureClass: input.texture, interpretation };
};

export const capCuticleTextureMapperTool = createSimpleTool({
  id: "mycology/cap-cuticle-texture-mapper",
  title: "Cap Cuticle Texture",
  description: "Map the observed cap surface texture to its cuticle class.",
  inputs: [
    {
      enum: CUTICLE_TEXTURES,
      id: "texture",
      kind: "string",
      label: "Texture",
    },
  ],
  outputs: [
    {
      enum: CUTICLE_TEXTURES,
      id: "cuticleTextureClass",
      kind: "string",
      label: "Cuticle texture class",
    },
    { id: "interpretation", kind: "string", label: "Interpretation" },
  ],
  calculate: (input) =>
    calculateCapCuticleTextureMapper({
      texture: input.texture as CapCuticleTextureMapperInput["texture"],
    }),
});
export const runCapCuticleTextureMapper = capCuticleTextureMapperTool.execute;
export default capCuticleTextureMapperTool;

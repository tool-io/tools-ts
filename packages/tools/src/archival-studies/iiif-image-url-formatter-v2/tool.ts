import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IiifImageUrlFormatterV2Input = {
  readonly baseUrl: string;
  readonly identifier: string;
  readonly region?: string;
  readonly size?: string;
  readonly rotation?: number;
  readonly quality?: "default" | "color" | "gray" | "bitonal";
  readonly format?: "jpg" | "png" | "tif" | "gif" | "webp" | "jp2" | "pdf";
};

export type IiifImageUrlFormatterV2Output = {
  readonly url: string;
  readonly normalizedRotation: number;
};

export const calculateIiifImageUrlFormatterV2 = (
  input: IiifImageUrlFormatterV2Input,
): IiifImageUrlFormatterV2Output => {
  const region = input.region ?? "full";
  const size = input.size ?? "full";
  const rotation = input.rotation ?? 0;
  const quality = input.quality ?? "default";
  const format = input.format ?? "jpg";
  const baseRaw = input.baseUrl;
  if (typeof baseRaw !== "string" || baseRaw.trim().length === 0)
    simpleError(
      "baseUrl",
      "Base URL must be a non-empty string.",
      "invalid_base_url",
    );
  const base = baseRaw.trim().replace(/\/+$/, "");
  if (base.length === 0)
    simpleError(
      "baseUrl",
      "Base URL must be a non-empty string.",
      "invalid_base_url",
    );
  if (
    typeof input.identifier !== "string" ||
    input.identifier.trim().length === 0
  )
    simpleError(
      "identifier",
      "Identifier must be a non-empty string.",
      "invalid_identifier",
    );
  if (
    typeof region !== "string" ||
    region.trim().length === 0 ||
    /[\s/]/.test(region)
  )
    simpleError(
      "region",
      "Region must be one non-empty IIIF path component without whitespace or '/'.",
      "invalid_region",
    );
  if (
    typeof size !== "string" ||
    size.trim().length === 0 ||
    /[\s/]/.test(size)
  )
    simpleError(
      "size",
      "Size must be one non-empty IIIF path component without whitespace or '/'.",
      "invalid_size",
    );
  if (!Number.isFinite(rotation) || rotation < 0)
    simpleError(
      "rotation",
      "Rotation must be a finite non-negative number.",
      "invalid_rotation",
    );
  if (!["default", "color", "gray", "bitonal"].includes(quality))
    simpleError("quality", "Unsupported IIIF v2 quality.", "invalid_quality");
  if (!["jpg", "png", "tif", "gif", "webp", "jp2", "pdf"].includes(format))
    simpleError("format", "Unsupported IIIF image format.", "invalid_format");
  const normalizedRotation = rotation % 360;
  const encodedIdentifier = encodeURIComponent(input.identifier.trim());
  const url =
    `${base}/${encodedIdentifier}/${region.trim()}/${size.trim()}/` +
    `${normalizedRotation}/${quality}.${format}`;
  return { url, normalizedRotation };
};

export const iiifImageUrlFormatterV2Example = {
  input: { baseUrl: "https://iiif.example.org", identifier: "ms042_f003" },
  output: {
    url: "https://iiif.example.org/ms042_f003/full/full/0/default.jpg",
    normalizedRotation: 0,
  },
} satisfies ToolExample<
  IiifImageUrlFormatterV2Input,
  IiifImageUrlFormatterV2Output
>;

export const iiifImageUrlFormatterV2Tool = createSimpleTool({
  id: "archival-studies/iiif-image-url-formatter-v2",
  title: "IIIF Image URL Parameter Sequence Formatter (v2)",
  description:
    "Assemble a canonical IIIF Image API 2.1 request URL, using the v2 default size keyword 'full' and percent-encoding special characters—including slashes—inside the image identifier.",
  inputs: [
    {
      description: "Image API service base URI without trailing slash.",
      id: "baseUrl",
      kind: "string",
      label: "Base URL",
    },
    {
      description:
        "Raw IIIF image identifier. Reserved characters and embedded slashes are percent-encoded as one identifier component.",
      id: "identifier",
      kind: "string",
      label: "Identifier",
    },
    {
      default: "full",
      description: "Region parameter such as full or x,y,w,h.",
      id: "region",
      kind: "string",
      label: "Region",
    },
    {
      default: "full",
      description: "IIIF v2 size parameter such as full, w, or w,h.",
      id: "size",
      kind: "string",
      label: "Size",
    },
    {
      default: 0,
      description: "Clockwise rotation in degrees; any non-negative value.",
      id: "rotation",
      kind: "number",
      label: "Rotation",
      minimum: 0,
    },
    {
      default: "default",
      description: "Quality parameter.",
      enum: ["default", "color", "gray", "bitonal"],
      id: "quality",
      kind: "string",
      label: "Quality",
    },
    {
      default: "jpg",
      description: "Output image format extension.",
      enum: ["jpg", "png", "tif", "gif", "webp", "jp2", "pdf"],
      id: "format",
      kind: "string",
      label: "Format",
    },
  ],
  outputs: [
    {
      description: "Complete IIIF Image API v2 request URL.",
      id: "url",
      kind: "string",
      label: "URL",
    },
    {
      description: "Rotation wrapped into the canonical 0-360 range.",
      id: "normalizedRotation",
      kind: "number",
      label: "Normalized rotation",
    },
  ],
  calculate: (input) =>
    calculateIiifImageUrlFormatterV2({
      baseUrl: input.baseUrl as string,
      format: (input.format as string | undefined) ?? undefined,
      identifier: input.identifier as string,
      quality: (input.quality as string | undefined) ?? undefined,
      region: (input.region as string | undefined) ?? undefined,
      rotation: (input.rotation as number | undefined) ?? undefined,
      size: (input.size as string | undefined) ?? undefined,
    }),
});

export const runIiifImageUrlFormatterV2 = iiifImageUrlFormatterV2Tool.execute;
export default iiifImageUrlFormatterV2Tool;

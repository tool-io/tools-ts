export class ColorParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ColorParseError";
  }
}

const expandShortHex = (hex: string): string =>
  /^[\da-f]{3}$/iu.test(hex)
    ? [...hex].map((digit) => digit + digit).join("")
    : hex;

/**
 * Parses a three- or six-digit hexadecimal sRGB color into its
 * red, green, and blue channels. Throws ColorParseError on bad input.
 */
export const parseHexColor = (value: string): [number, number, number] => {
  if (typeof value !== "string")
    throw new ColorParseError("A color must be text.");
  const hex = expandShortHex(value.trim().replace(/^#/u, ""));
  if (!/^[\da-f]{6}$/iu.test(hex))
    throw new ColorParseError(
      "Enter a three- or six-digit hexadecimal color.",
    );
  return [0, 2, 4].map((offset) =>
    Number.parseInt(hex.slice(offset, offset + 2), 16),
  ) as [number, number, number];
};

/** Clamps a raw channel value into the integer 0-255 range. */
export const clampColorChannel = (value: number): number =>
  Math.min(255, Math.max(0, Math.round(value)));

/** Formats channels as an uppercase #RRGGBB color with clamped rounding. */
export const formatHexColor = (
  channels: readonly number[],
): string => {
  const hex = channels
    .slice(0, 3)
    .map((channel) =>
      clampColorChannel(channel).toString(16).padStart(2, "0"),
    )
    .join("");
  return `#${hex.toUpperCase()}`;
};

from pathlib import Path
from math import pi, sin

from PIL import Image


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = PROJECT_ROOT / "public/assets/trees"
OUTPUT_DIR = SOURCE_DIR / "sway"
FRAME_COUNT = 8


def create_sway_frame(source: Image.Image, phase: float) -> Image.Image:
    """生成单帧树木摆动图，底部树根保持固定。"""
    width, height = source.size
    output = Image.new("RGBA", source.size, (0, 0, 0, 0))
    max_shift = max(3, round(width * 0.036))
    direction = sin(phase * 2 * pi)

    for y in range(height):
        distance_from_root = (height - 1 - y) / max(1, height - 1)
        # 树根附近不移动，越接近树冠摆动幅度越大。
        bend = max(0.0, (distance_from_root - 0.18) / 0.82) ** 1.65
        shift = round(max_shift * direction * bend)
        row = source.crop((0, y, width, y + 1))
        output.alpha_composite(row, (shift, y))

    return output


def main() -> None:
    for stage in range(1, 6):
        source_path = SOURCE_DIR / f"stage-{stage}.webp"
        stage_dir = OUTPUT_DIR / f"stage-{stage}"
        stage_dir.mkdir(parents=True, exist_ok=True)
        source = Image.open(source_path).convert("RGBA")

        for frame_index in range(FRAME_COUNT):
            frame = create_sway_frame(source, frame_index / FRAME_COUNT)
            frame.save(
                stage_dir / f"frame-{frame_index + 1:02d}.webp",
                "WEBP",
                lossless=True,
                method=6,
            )


if __name__ == "__main__":
    main()

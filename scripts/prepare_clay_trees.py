from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/assets/trees/candy-clay"

# 按成长程度重新排列用户提供的四张素材。
SOURCES = {
    1: Path("/var/folders/wf/j_880xwx5hb3x3j1pgvp3mt80000gn/T/codex-clipboard-38d09e1f-b883-4d5d-ba9b-ef6686a3c362.png"),
    2: Path("/var/folders/wf/j_880xwx5hb3x3j1pgvp3mt80000gn/T/codex-clipboard-154a44ff-a5fc-4883-bb3a-8767ac31aeda.png"),
    3: Path("/var/folders/wf/j_880xwx5hb3x3j1pgvp3mt80000gn/T/codex-clipboard-e4dbaaf0-7585-4545-ba68-ce04e760a338.png"),
    4: Path("/var/folders/wf/j_880xwx5hb3x3j1pgvp3mt80000gn/T/codex-clipboard-7e303707-bb4c-413a-b192-1325ddba004e.png"),
}

RECTS = {
    1: (420, 300, 1200, 1500),
    2: (320, 400, 1420, 1380),
    3: (260, 300, 1540, 1500),
    4: (210, 180, 1650, 1650),
}


def extract_subject(path: Path, stage: int) -> Image.Image:
    image = Image.open(path).convert("RGB")
    rgb = np.asarray(image)
    bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    mask = np.zeros(bgr.shape[:2], np.uint8)
    background_model = np.zeros((1, 65), np.float64)
    foreground_model = np.zeros((1, 65), np.float64)
    cv2.grabCut(
        bgr,
        mask,
        RECTS[stage],
        background_model,
        foreground_model,
        5,
        cv2.GC_INIT_WITH_RECT,
    )
    alpha = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    alpha = cv2.GaussianBlur(alpha, (0, 0), 0.8)
    alpha[alpha < 12] = 0
    subject = Image.fromarray(np.dstack((rgb, alpha)))
    bbox = subject.getchannel("A").getbbox()
    if not bbox:
        raise RuntimeError(f"无法从 {path} 提取树木")
    return subject.crop(bbox)


def compose_stage(stage: int, subject: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", (1024, 1024))
    max_sizes = {
        1: (500, 650),
        2: (610, 720),
        3: (720, 790),
        4: (820, 850),
    }
    max_width, max_height = max_sizes[stage]
    scale = min(max_width / subject.width, max_height / subject.height)
    resized = subject.resize(
        (round(subject.width * scale), round(subject.height * scale)),
        Image.Resampling.LANCZOS,
    )
    baseline = 910
    canvas.alpha_composite(resized, ((1024 - resized.width) // 2, baseline - resized.height))
    if stage == 2:
        rgba = np.asarray(canvas).copy()
        rgb = rgba[:, :, :3].astype(np.int16)
        saturation = rgb.max(axis=2) - rgb.min(axis=2)
        luminance = rgb.mean(axis=2)
        white_floor = (np.indices(saturation.shape)[0] > 815) & (saturation < 18) & (luminance > 205)
        rgba[white_floor, 3] = 0
        canvas = Image.fromarray(rgba)
    return canvas


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for stage, source in SOURCES.items():
        if not source.exists():
            raise FileNotFoundError(source)
        output = compose_stage(stage, extract_subject(source, stage))
        output.save(OUTPUT / f"stage-{stage}.webp", "WEBP", lossless=True, quality=94)


if __name__ == "__main__":
    main()

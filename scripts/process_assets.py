from pathlib import Path
from PIL import Image, ImageChops, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/Users/luoqiwei/study_report/创意播放器页面开发/assets')
OUT = ROOT / 'public' / 'assets'


def remove_near_white(image: Image.Image) -> Image.Image:
    rgb = image.convert('RGB')
    r, g, b = rgb.split()
    diff = ImageChops.lighter(ImageChops.invert(r), ImageChops.lighter(ImageChops.invert(g), ImageChops.invert(b)))
    alpha = diff.point(lambda value: 0 if value < 7 else min(255, (value - 7) * 9))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.35))
    rgba = rgb.convert('RGBA')
    rgba.putalpha(alpha)
    return rgba


def foreground_bbox(image: Image.Image):
    alpha = image.getchannel('A')
    return alpha.getbbox()


def process_trees():
    source = Image.open(SOURCE / 'ip-tree-five-stages.png')
    bands = [(0, 190), (180, 480), (455, 825), (800, 1335), (1300, 1920)]
    pieces = []
    for left, right in bands:
        piece = remove_near_white(source.crop((left, 0, right, source.height)))
        bbox = foreground_bbox(piece)
        if not bbox:
            raise RuntimeError(f'未在树素材区间 {left}-{right} 识别到主体')
        pieces.append(piece.crop(bbox))

    max_height = max(piece.height for piece in pieces)
    scale = 610 / max_height
    target_dir = OUT / 'trees'
    target_dir.mkdir(parents=True, exist_ok=True)
    for index, piece in enumerate(pieces, start=1):
        size = (max(1, round(piece.width * scale)), max(1, round(piece.height * scale)))
        resized = piece.resize(size, Image.Resampling.NEAREST)
        resized.save(target_dir / f'stage-{index}.webp', 'WEBP', lossless=True, quality=100)


def process_dolls():
    source = Image.open(SOURCE / 'roman-city-dolls.png')
    names = ['futa', 'happy-teeth', 'shalala', 'green', 'sulong']
    row_height = source.height / 5
    target_dir = OUT / 'dolls'
    target_dir.mkdir(parents=True, exist_ok=True)
    for index, name in enumerate(names):
        top = round(index * row_height)
        bottom = round((index + 1) * row_height)
        cell = source.crop((0, top, round(source.width / 3), bottom))
        rgba = remove_near_white(cell)
        bbox = foreground_bbox(rgba)
        if not bbox:
            raise RuntimeError(f'未识别到玩偶 {name}')
        piece = rgba.crop(bbox)
        scale = min(280 / piece.width, 286 / piece.height)
        size = (max(1, round(piece.width * scale)), max(1, round(piece.height * scale)))
        resized = piece.resize(size, Image.Resampling.NEAREST)
        canvas = Image.new('RGBA', (320, 320), (0, 0, 0, 0))
        canvas.alpha_composite(resized, ((320 - resized.width) // 2, 306 - resized.height))
        canvas.save(target_dir / f'{name}-front.webp', 'WEBP', lossless=True, quality=100)


def copy_references():
    target_dir = OUT / 'reference'
    target_dir.mkdir(parents=True, exist_ok=True)
    for filename in ['ip-tree-five-stages.png', 'roman-city-dolls.png', 'forest-background-reference.png']:
        Image.open(SOURCE / filename).save(target_dir / filename)


if __name__ == '__main__':
    process_trees()
    process_dolls()
    copy_references()
    print(f'素材已生成到 {OUT}')

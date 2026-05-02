from PIL import Image
from pathlib import Path

def batch_convert(folder_input, folder_output=None, quality=80):
    input_dir = Path(folder_input)
    output_dir = Path(folder_output) if folder_output else input_dir
    output_dir.mkdir(parents=True, exist_ok=True)

    jpg_files = list(input_dir.glob("*.jpg")) + list(input_dir.glob("*.jpeg"))

    for jpg_file in jpg_files:
        output_path = output_dir / (jpg_file.stem + ".webp")
        with Image.open(jpg_file) as img:
            img.save(output_path, "WEBP", quality=quality)
            print(f"✓ {jpg_file.name} → {output_path.name}")

    print(f"\nSelesai! {len(jpg_files)} file diconvert.")

# Contoh penggunaan
batch_convert("./public/images", "./public/output", quality=85)
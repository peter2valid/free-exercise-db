#!/usr/bin/env python3
"""
Generate animated GIFs for each exercise from its 0.jpg and 1.jpg images.
Output: public/exercises/<ExerciseName>/animation.gif
"""

import os
from PIL import Image

EXERCISES_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'exercises')
FRAME_DURATION = 700  # ms per frame (matches existing JS animation speed)
GIF_SIZE = (400, 400)  # consistent size for all GIFs

processed = 0
skipped = 0
errors = 0

folders = sorted([
    f for f in os.listdir(EXERCISES_DIR)
    if os.path.isdir(os.path.join(EXERCISES_DIR, f))
])

print(f"🎬  Generating GIFs for {len(folders)} exercises...")

for folder in folders:
    folder_path = os.path.join(EXERCISES_DIR, folder)
    frame0 = os.path.join(folder_path, '0.jpg')
    frame1 = os.path.join(folder_path, '1.jpg')
    out_gif = os.path.join(folder_path, 'animation.gif')

    # Skip if GIF already exists (re-run safe)
    if os.path.exists(out_gif):
        skipped += 1
        continue

    # Need at least frame 0
    if not os.path.exists(frame0):
        skipped += 1
        continue

    try:
        img0 = Image.open(frame0).convert('RGB')
        img0 = img0.resize(GIF_SIZE, Image.LANCZOS)

        frames = [img0]

        if os.path.exists(frame1):
            img1 = Image.open(frame1).convert('RGB')
            img1 = img1.resize(GIF_SIZE, Image.LANCZOS)
            frames.append(img1)

        # Save as animated GIF
        frames[0].save(
            out_gif,
            format='GIF',
            save_all=True,
            append_images=frames[1:],
            duration=FRAME_DURATION,
            loop=0,  # loop forever
            optimize=True,
        )

        processed += 1
        if processed % 100 == 0:
            print(f"   ✔ {processed}/{len(folders)} done")

    except Exception as e:
        print(f"   ❌ Error on {folder}: {e}")
        errors += 1

print(f"\n✅  Done! {processed} GIFs created, {skipped} skipped, {errors} errors.")

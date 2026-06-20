from PIL import Image
import os

# الامتدادات المدعومة
IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp", ".bmp")

# إنشاء مجلد الإخراج
output_dir = "output"
os.makedirs(output_dir, exist_ok=True)

# المقاس المطلوب
TARGET_SIZE = (800, 450)

for filename in os.listdir("."):
    if filename.lower().endswith(IMAGE_EXTENSIONS):
        try:
            img = Image.open(filename)

            # تحويل للصيغ التي لا تدعم الشفافية
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            # تغيير الحجم
            resized_img = img.resize(TARGET_SIZE, Image.LANCZOS)

            # حفظ الصورة
            output_path = os.path.join(output_dir, filename)
            resized_img.save(output_path, quality=95)

            print(f"✓ تم تحويل: {filename}")

        except Exception as e:
            print(f"✗ خطأ في {filename}: {e}")

print("\nانتهى تحويل جميع الصور.")

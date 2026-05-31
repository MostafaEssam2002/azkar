import requests
import os
from pathlib import Path

# Create directory for images
output_dir = "reciters_images"
os.makedirs(output_dir, exist_ok=True)

# Dictionary of reciters with their image URLs
reciters_images = {
    "ibrahim_alakdar": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/5d4dabc99-a66f-42b9-8e1e-dd94c37ac8538616.png",
    "abu_bakr_al_shatri": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/198be62ad-c665-4a60-a381-594c62e445474488.png",
    "ahmad_alajmy": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/098be62ad-c665-4a60-a381-594c62e445472608.png",
    "ahmad_alhawashi": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/298be62ad-c665-4a60-a381-594c62e445472967.png",
    "ahmad_saber": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/098be62ad-c665-4a60-a381-594c62e445471192.png",
    "ahmad_nauina": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/498be62ad-c665-4a60-a381-594c62e445475455.png",
    "akram_alalaqmi": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/598be62ad-c665-4a60-a381-594c62e445472281.png",
    "idrees_abkr": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/398be62ad-c665-4a60-a381-594c62e445473124.png",
    "alzain_mohammad_ahmad": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/298be62ad-c665-4a60-a381-594c62e445479546.png",
    "alqaria_yassen": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/098be62ad-c665-4a60-a381-594c62e445474345.png",
    "aloyoon_alkoshi": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/198be62ad-c665-4a60-a381-594c62e445477215.png",
    "tawfeeq_assayegh": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/498be62ad-c665-4a60-a381-594c62e445476448.png",
    "jamal_shaker_abdullah": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/498be62ad-c665-4a60-a381-594c62e445477965.png",
    "khaled_alqahtani": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/098be62ad-c665-4a60-a381-594c62e445478325.png",
    "khalid_abdulkafi": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/498be62ad-c665-4a60-a381-594c62e445479749.png",
    "khalifa_altunaiji": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/598be62ad-c665-4a60-a381-594c62e445475132.png",
    "saad_alghamdi": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/298be62ad-c665-4a60-a381-594c62e445474374.png",
    "saud_alshuraim": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/098be62ad-c665-4a60-a381-594c62e445478006.png",
    "sahl_yassin": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/198be62ad-c665-4a60-a381-594c62e445474776.png",
    "zaki_daghistani": "https://image.qwenlm.ai/public_source/e49b1fe6-263d-4adf-ac16-7b9f6d9bd1a3/098be62ad-c665-4a60-a381-594c62e445479665.png"
}

def download_image(filename, url):
    """Download image from URL and save it with the specified filename"""
    try:
        print(f"Downloading {filename}...")
        response = requests.get(url, stream=True, timeout=30)
        response.raise_for_status()
        
        filepath = os.path.join(output_dir, f"{filename}.jpg")
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"✓ Successfully downloaded: {filename}.jpg")
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"✗ Error downloading {filename}: {str(e)}")
        return False

def main():
    print("=" * 60)
    print("Quran Reciters Images Downloader")
    print("=" * 60)
    print(f"\nTotal images to download: {len(reciters_images)}\n")
    
    success_count = 0
    failed_count = 0
    
    for reciter_name, image_url in reciters_images.items():
        if download_image(reciter_name, image_url):
            success_count += 1
        else:
            failed_count += 1
    
    print("\n" + "=" * 60)
    print("Download Summary:")
    print("=" * 60)
    print(f"✓ Successful: {success_count}")
    print(f"✗ Failed: {failed_count}")
    print(f"Total: {success_count + failed_count}")
    print(f"\nImages saved in: {os.path.abspath(output_dir)}")
    print("=" * 60)

if __name__ == "__main__":
    main()
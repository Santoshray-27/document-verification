from fastapi import FastAPI, UploadFile, File
import uvicorn

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/qr")
def extract_qr(file: UploadFile = File(...)):
    return {"payload": None, "error": "Not fully implemented in stub"}

@app.post("/ocr")
def extract_ocr(file: UploadFile = File(...)):
    return {"text": "dummy extracted text"}

@app.post("/diff")
def diff_images(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    return {"ssim": 0.95, "heatmap": "base64..."}

@app.post("/phash")
def phash_image(file: UploadFile = File(...)):
    return {"hash": "0000000000000000"}

@app.post("/metadata")
def extract_metadata(file: UploadFile = File(...)):
    return {"creator": "Agnitia", "created_at": "2026-10-09"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)

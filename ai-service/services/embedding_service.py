import os

# Set environment variable to avoid tokenizers parallelism warning
os.environ["TOKENIZERS_PARALLELISM"] = "false"

# Global placeholder for the model
embedding_model = None

def init_embedding_model():
    global embedding_model
    if embedding_model is None:
        try:
            print("⏳ Pre-loading sentence-transformers model (all-MiniLM-L6-v2) into memory...")
            from sentence_transformers import SentenceTransformer
            # all-MiniLM-L6-v2 is small (80MB) and very fast
            embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            print("✅ Sentence-transformers model loaded successfully!")
        except ImportError:
            print("⚠️ sentence-transformers not installed. Skipping model pre-load.")
        except Exception as e:
            print(f"❌ Failed to load sentence-transformers model: {e}")

def get_embedding_model():
    return embedding_model
